import ExpoModulesCore
#if canImport(FoundationModels)
import FoundationModels
#endif

struct GenerateOptions: Record {
  @Field var requestId: String = ""
  @Field var prompt: String = ""
  @Field var system: String?
  @Field var temperature: Double?
  @Field var maxTokens: Int?
  /** JSON Schema subset (object/array/string/number/integer/boolean/enum) as a JSON string. */
  @Field var schemaJson: String?
  @Field var stream: Bool = false
}

enum LlmError: Error, CustomStringConvertible {
  case unavailable(String)
  case badSchema(String)

  var description: String {
    switch self {
    case .unavailable(let reason): return "On-device model unavailable: \(reason)"
    case .badSchema(let reason): return "Invalid schema: \(reason)"
    }
  }
}

public class OnDeviceLlmModule: Module {
  // generate() and cancel() run on different threads, so guard the in-flight map.
  private var tasks: [String: Task<String, Error>] = [:]
  private let tasksLock = NSLock()

  private func setTask(_ id: String, _ task: Task<String, Error>?) {
    tasksLock.lock()
    defer { tasksLock.unlock() }
    tasks[id] = task
  }

  private func cancelTask(_ id: String) {
    tasksLock.lock()
    let task = tasks.removeValue(forKey: id)
    tasksLock.unlock()
    task?.cancel()
  }

  public func definition() -> ModuleDefinition {
    Name("OnDeviceLlm")

    Events("onChunk")

    AsyncFunction("getAvailability") { () -> [String: Any] in
      return Self.availability()
    }

    AsyncFunction("prepare") { () async -> Void in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, *) {
        LanguageModelSession(model: SystemLanguageModel.default).prewarm()
      }
      #endif
    }

    AsyncFunction("generate") { (options: GenerateOptions) async throws -> String in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, *) {
        let task = Task { try await self.run(options) }
        self.setTask(options.requestId, task)
        defer { self.setTask(options.requestId, nil) }
        return try await task.value
      }
      #endif
      throw LlmError.unavailable("requires iOS 26 with Apple Intelligence")
    }

    Function("cancel") { (requestId: String) in
      self.cancelTask(requestId)
    }
  }

  static func availability() -> [String: Any] {
    #if canImport(FoundationModels)
    if #available(iOS 26.0, *) {
      let model = SystemLanguageModel.default
      let supportsSpanish = model.supportsLocale(Locale(identifier: "es_MX"))
      switch model.availability {
      case .available:
        return ["status": "available", "backend": "apple", "supportsSpanish": supportsSpanish]
      case .unavailable(.modelNotReady):
        return ["status": "downloading", "backend": "apple", "reason": "The Apple Intelligence model is still downloading."]
      case .unavailable(.appleIntelligenceNotEnabled):
        return ["status": "unavailable", "backend": "apple", "reason": "Turn on Apple Intelligence in Settings to enable AI features."]
      case .unavailable(.deviceNotEligible):
        return ["status": "unavailable", "backend": "apple", "reason": "This device doesn't support Apple Intelligence."]
      case .unavailable(let other):
        return ["status": "unavailable", "backend": "apple", "reason": "Apple Intelligence unavailable (\(other))."]
      }
    }
    #endif
    return ["status": "unavailable", "backend": "none", "reason": "Requires iOS 26 or later with Apple Intelligence."]
  }

  #if canImport(FoundationModels)
  @available(iOS 26.0, *)
  private func run(_ options: GenerateOptions) async throws -> String {
    let session: LanguageModelSession
    if let system = options.system, !system.isEmpty {
      session = LanguageModelSession(model: SystemLanguageModel.default, instructions: system)
    } else {
      session = LanguageModelSession(model: SystemLanguageModel.default)
    }
    let genOptions = GenerationOptions(
      temperature: options.temperature,
      maximumResponseTokens: options.maxTokens
    )

    if let schemaJson = options.schemaJson, !schemaJson.isEmpty {
      let schema = try Self.buildSchema(schemaJson)
      let response = try await session.respond(to: options.prompt, schema: schema, options: genOptions)
      return response.content.jsonString
    }

    if options.stream {
      var latest = ""
      for try await snapshot in session.streamResponse(to: options.prompt, options: genOptions) {
        try Task.checkCancellation()
        latest = snapshot.content
        sendEvent("onChunk", ["requestId": options.requestId, "text": latest])
      }
      return latest
    }

    let response = try await session.respond(to: options.prompt, options: genOptions)
    return response.content
  }

  // MARK: - JSON Schema -> DynamicGenerationSchema

  @available(iOS 26.0, *)
  static func buildSchema(_ json: String) throws -> GenerationSchema {
    guard let data = json.data(using: .utf8),
          let root = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
      throw LlmError.badSchema("not a JSON object")
    }
    var counter = 0
    let dynamic = try convert(root, name: "Root", counter: &counter)
    return try GenerationSchema(root: dynamic, dependencies: [])
  }

  @available(iOS 26.0, *)
  private static func convert(_ node: [String: Any], name: String, counter: inout Int) throws -> DynamicGenerationSchema {
    let description = node["description"] as? String
    if let choices = node["enum"] as? [String] {
      return DynamicGenerationSchema(name: name, description: description, anyOf: choices)
    }
    let type = node["type"] as? String ?? "string"
    switch type {
    case "object":
      let props = node["properties"] as? [String: Any] ?? [:]
      let required = Set(node["required"] as? [String] ?? Array(props.keys))
      // Preserve declared order when provided so the model generates fields in a sensible sequence.
      let order = (node["propertyOrder"] as? [String]) ?? props.keys.sorted()
      var properties: [DynamicGenerationSchema.Property] = []
      for key in order {
        guard let child = props[key] as? [String: Any] else { continue }
        counter += 1
        let childSchema = try convert(child, name: "\(name)_\(key)_\(counter)", counter: &counter)
        properties.append(DynamicGenerationSchema.Property(
          name: key,
          description: child["description"] as? String,
          schema: childSchema,
          isOptional: !required.contains(key)
        ))
      }
      return DynamicGenerationSchema(name: name, description: description, properties: properties)
    case "array":
      guard let items = node["items"] as? [String: Any] else {
        throw LlmError.badSchema("array without items")
      }
      counter += 1
      let itemSchema = try convert(items, name: "\(name)_item_\(counter)", counter: &counter)
      return DynamicGenerationSchema(
        arrayOf: itemSchema,
        minimumElements: node["minItems"] as? Int,
        maximumElements: node["maxItems"] as? Int
      )
    case "number":
      return DynamicGenerationSchema(type: Double.self)
    case "integer":
      return DynamicGenerationSchema(type: Int.self)
    case "boolean":
      return DynamicGenerationSchema(type: Bool.self)
    default:
      return DynamicGenerationSchema(type: String.self)
    }
  }
  #endif
}
