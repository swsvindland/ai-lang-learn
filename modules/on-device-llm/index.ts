import { NativeModule, requireOptionalNativeModule } from 'expo';

export type LlmBackend = 'apple' | 'gemini-nano' | 'none';

export type LlmAvailability = {
  status: 'available' | 'downloadable' | 'downloading' | 'unavailable';
  backend: LlmBackend;
  reason?: string;
  supportsSpanish?: boolean;
};

export type NativeGenerateOptions = {
  requestId: string;
  prompt: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  schemaJson?: string;
  stream?: boolean;
};

type Events = {
  onChunk(event: { requestId: string; text: string }): void;
  onDownloadProgress(event: { bytes: number }): void;
};

declare class OnDeviceLlmNativeModule extends NativeModule<Events> {
  getAvailability(): Promise<LlmAvailability>;
  prepare(): Promise<void>;
  generate(options: NativeGenerateOptions): Promise<string>;
  cancel(requestId: string): void;
}

/** Null on web, Expo Go, and any build without the native module linked. */
export const OnDeviceLlm = requireOptionalNativeModule<OnDeviceLlmNativeModule>('OnDeviceLlm');
