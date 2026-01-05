export interface ProcessingStatus {
  step: 'idle' | 'uploading' | 'enhancing' | 'completed' | 'error';
  message: string;
}

export interface EnhancementResult {
  imageUrl: string;
  originalUrl: string;
}

export enum AppState {
  READY = 'READY',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT'
}
