'use client';
export function getAuthToken() {
    if (typeof window === 'undefined')
        return null;
    return localStorage.getItem('linkcraft_token');
}
export function getCurrentUser() {
    if (typeof window === 'undefined')
        return null;
    const stored = localStorage.getItem('linkcraft_user');
    if (!stored)
        return null;
    try {
        return JSON.parse(stored);
    }
    catch {
        return null;
    }
}
export function getAuthHeaders(extraHeaders) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return { ...headers, ...extraHeaders };
}
export async function authFetch(url, options = {}) {
    const token = getAuthToken();
    const headers = new Headers(options.headers || {});
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        logout('expired');
    } else if (res.status === 403) {
        try {
            const clone = res.clone();
            const data = await clone.json();
            if (data?.suspended || (data?.error && data.error.toLowerCase().includes('suspend'))) {
                logout('suspended');
            }
        } catch {
            // Not JSON or stream consumed
        }
    }

    return res;
}
export function logout(reason = null) {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('linkcraft_token');
        localStorage.removeItem('linkcraft_user');
        const query = reason ? `?reason=${encodeURIComponent(reason)}` : '';
        window.location.href = `/login${query}`;
    }
}
