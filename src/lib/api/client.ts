export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = null;
        }
        
        if (response.status === 401 && typeof window !== 'undefined') {
            // Optional: handle automatic logout if unauthorized
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }

        throw new ApiError(
            response.status,
            errorData?.message || errorData?.error || 'An error occurred',
            errorData
        );
    }

    // Handle 204 No Content
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null as any;
    }

    return response.json();
}
