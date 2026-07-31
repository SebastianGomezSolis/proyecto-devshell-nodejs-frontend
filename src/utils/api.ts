const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

const REQUEST_TIMEOUT = 6000;

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('token-changed'));
          return null;
        }
        const data = await response.json();
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          return data.token as string;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request<T>(endpoint: string, options: RequestOptions = {}, retried = false): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body instanceof FormData ? options.body as FormData : options.body ? JSON.stringify(options.body) : undefined,
      credentials: 'include',
      signal: controller.signal,
    });

    if (response.status === 401 && !retried && endpoint !== '/auth/refresh' && !endpoint.startsWith('/auth/login')) {
      const newToken = await refreshAccessToken();
      if (newToken) return request<T>(endpoint, options, true);
    }

    if (!response.ok) {
      let errorMsg = 'Error en la solicitud';
      try {
        const data = await response.json();
        if (data && data.message) errorMsg = data.message;
        if (data && data.error) errorMsg = data.error;
      } catch {
        // keep default
      }
      throw new Error(errorMsg);
    }

    const text = await response.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, { method: 'PUT', body }),
  del: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
