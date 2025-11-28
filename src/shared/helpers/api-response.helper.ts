export interface IApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: unknown;
  metadata: {
    timestamp: string;
    [key: string]: unknown;
  };
}

export interface CreateSuccessResponseOptions<T> {
  data?: T;
  message?: string;
  statusCode?: number;
  metadata?: Record<string, unknown>;
}

export interface CreateErrorResponseOptions {
  message?: string;
  statusCode?: number;
  error?: unknown;
  metadata?: Record<string, unknown>;
}

export function createSuccessResponse<T>({
  data,
  message = 'Operation successful',
  statusCode = 200,
  metadata = {},
}: CreateSuccessResponseOptions<T>): IApiResponse<T> {
  return {
    success: true,
    statusCode,
    message,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };
}

export function createErrorResponse({
  message = 'An error occurred',
  statusCode = 500,
  error = {},
  metadata = {},
}: CreateErrorResponseOptions): IApiResponse {
  return {
    success: false,
    statusCode,
    message,
    error,
    metadata: {
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };
}
