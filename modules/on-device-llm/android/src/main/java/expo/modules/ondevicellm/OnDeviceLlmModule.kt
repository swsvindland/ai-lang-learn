package expo.modules.ondevicellm

import com.google.mlkit.genai.common.DownloadStatus
import com.google.mlkit.genai.common.FeatureStatus
import com.google.mlkit.genai.prompt.Generation
import com.google.mlkit.genai.prompt.GenerativeModel
import com.google.mlkit.genai.prompt.TextPart
import com.google.mlkit.genai.prompt.generateContentRequest
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import kotlinx.coroutines.Job
import kotlinx.coroutines.currentCoroutineContext
import java.util.concurrent.ConcurrentHashMap

class GenerateOptions : Record {
  @Field val requestId: String = ""
  @Field val prompt: String = ""
  @Field val system: String? = null
  @Field val temperature: Double? = null
  @Field val maxTokens: Int? = null
  // Gemini Nano has no runtime schema support; the JS layer puts the schema in the prompt.
  @Field val schemaJson: String? = null
  @Field val stream: Boolean = false
}

class OnDeviceLlmModule : Module() {
  private val model: GenerativeModel by lazy { Generation.getClient() }
  private val jobs = ConcurrentHashMap<String, Job>()

  override fun definition() = ModuleDefinition {
    Name("OnDeviceLlm")

    Events("onChunk", "onDownloadProgress")

    AsyncFunction("getAvailability") Coroutine { ->
      availability()
    }

    AsyncFunction("prepare") Coroutine { ->
      when (model.checkStatus()) {
        FeatureStatus.DOWNLOADABLE, FeatureStatus.DOWNLOADING -> {
          model.download().collect { status ->
            when (status) {
              is DownloadStatus.DownloadProgress ->
                sendEvent("onDownloadProgress", mapOf("bytes" to status.totalBytesDownloaded))
              is DownloadStatus.DownloadFailed -> throw status.e
              else -> Unit
            }
          }
          model.warmup()
        }
        FeatureStatus.AVAILABLE -> model.warmup()
        else -> Unit
      }
    }

    AsyncFunction("generate") Coroutine { options: GenerateOptions ->
      currentCoroutineContext()[Job]?.let { jobs[options.requestId] = it }
      try {
        generate(options)
      } finally {
        jobs.remove(options.requestId)
      }
    }

    Function("cancel") { requestId: String ->
      jobs[requestId]?.cancel()
    }
  }

  private suspend fun availability(): Map<String, Any?> {
    return try {
      when (model.checkStatus()) {
        FeatureStatus.AVAILABLE -> mapOf("status" to "available", "backend" to "gemini-nano")
        FeatureStatus.DOWNLOADABLE -> mapOf(
          "status" to "downloadable",
          "backend" to "gemini-nano",
          "reason" to "Gemini Nano needs to be downloaded before AI features work."
        )
        FeatureStatus.DOWNLOADING -> mapOf(
          "status" to "downloading",
          "backend" to "gemini-nano",
          "reason" to "Gemini Nano is downloading."
        )
        else -> mapOf(
          "status" to "unavailable",
          "backend" to "gemini-nano",
          "reason" to "This device doesn't support Gemini Nano."
        )
      }
    } catch (e: Exception) {
      mapOf("status" to "unavailable", "backend" to "none", "reason" to (e.message ?: "Gemini Nano unavailable"))
    }
  }

  private suspend fun generate(options: GenerateOptions): String {
    // The Prompt API has no system-instruction slot, so the system text leads the prompt.
    val fullPrompt = if (options.system.isNullOrBlank()) {
      options.prompt
    } else {
      "${options.system}\n\n${options.prompt}"
    }
    val request = generateContentRequest(TextPart(fullPrompt)) {
      options.temperature?.let { temperature = it.toFloat() }
      options.maxTokens?.let { maxOutputTokens = it }
    }

    if (options.stream) {
      val builder = StringBuilder()
      model.generateContentStream(request).collect { chunk ->
        builder.append(chunk.candidates.firstOrNull()?.text ?: "")
        sendEvent("onChunk", mapOf("requestId" to options.requestId, "text" to builder.toString()))
      }
      return builder.toString()
    }

    val response = model.generateContent(request)
    return response.candidates.firstOrNull()?.text ?: ""
  }
}
