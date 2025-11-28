import { useAuthStore } from '@/store/authStore';

export async function apiFetch(
  url: string | URL | Request,
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 401) {
    useAuthStore.getState().clearAuth();

    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    throw new Error('Unauthorized: Please log in again');
  }

  return response;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'https://scapi.elitceler.com/api/v1';
  }

  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const response = await apiFetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(includeAuth),
        ...(options.headers as Record<string, string> || {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, includeAuth);
  }

  async post<T>(endpoint: string, data?: unknown, includeAuth: boolean = true): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  async patch<T>(endpoint: string, data?: unknown, includeAuth: boolean = true): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  async put<T>(endpoint: string, data?: unknown, includeAuth: boolean = true): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, includeAuth);
  }
}

export const apiClient = new ApiClient();

