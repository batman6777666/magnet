import type { ExtractPayload, ExtractResponse, RegisterResponse, HealthResponse, ApiError } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      const text = await response.text().catch(() => '');
      throw new Error(text || `Request failed (${response.status})`);
    }

    if (!response.ok) {
      const error = data as ApiError;
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    return data as T;
  }

  async register(name: string, email?: string): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    });
  }

  async extract(apiKey: string, payload: ExtractPayload): Promise<ExtractResponse> {
    return this.request<ExtractResponse>('/v1/extract', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });
  }

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async ping(): Promise<{ status: string; timestamp: string }> {
    await this.request<unknown>('/health');
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

export const apiClient = new ApiClient();
export default apiClient;
