Pod::Spec.new do |s|
  s.name           = 'OnDeviceLlm'
  s.version        = '0.1.0'
  s.summary        = 'On-device LLM bridge (Apple Foundation Models / Gemini Nano)'
  s.description    = 'Local Expo module wrapping Apple Foundation Models on iOS and ML Kit GenAI Prompt API on Android.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: '' }
  s.static_framework = true
  s.swift_version  = '5.9'

  s.dependency 'ExpoModulesCore'
  s.weak_frameworks = 'FoundationModels'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
