interface ApiError<T = void> {
  error: string;
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
}

interface ApiSuccess<T = void> {
  statusCode: number;
  success: boolean;
  data?: T;
}

export type { ApiError, ApiSuccess };
