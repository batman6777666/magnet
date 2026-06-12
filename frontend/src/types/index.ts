export type ContentType = 'movie' | 'series';

export interface ExtractPayload {
  type: ContentType;
  name: string;
  season?: number;
  episode?: number;
}

export interface ExtractResponse {
  success: boolean;
  request_time_ms: number;
  data: {
    type: ContentType;
    original_name: string;
    normalized_name: string;
    source_url: string;
    links: {
      rpm: string | null;
      p2p: string | null;
      upn: string | null;
    };
    generated_at: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    api_key: string;
    name: string;
    created_at: string;
  };
}

export interface HealthResponse {
  status: string;
  uptime: number;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
}
