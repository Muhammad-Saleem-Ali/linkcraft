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
    return res;
}
export function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('linkcraft_token');
        localStorage.removeItem('linkcraft_user');
        window.location.href = '/login';
    }
}
