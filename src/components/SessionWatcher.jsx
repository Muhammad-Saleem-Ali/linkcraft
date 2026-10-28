'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getAuthToken, getCurrentUser, logout } from '@/utils/auth';

export default function SessionWatcher() {
    const pathname = usePathname();

    useEffect(() => {
        // Do not perform session invalidation checks if already on the login page
        if (pathname && pathname.startsWith('/login')) {
            return;
        }

        let eventSource = null;

        const verifyLiveSession = async () => {
            const token = getAuthToken();
            if (!token) return;

            const localUser = getCurrentUser();
            if (localUser && localUser.status === 'suspended') {
                logout('suspended');
                return;
            }

            try {
                const res = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (res.status === 401) {
                    logout('expired');
                    return;
                }

                if (res.status === 403) {
                    const data = await res.json().catch(() => ({}));
                    if (data?.suspended || (data?.error && data.error.toLowerCase().includes('suspend'))) {
                        logout('suspended');
                        return;
                    }
                }

                if (res.ok) {
                    const data = await res.json().catch(() => ({}));
                    if (data?.success && data?.user) {
                        if (data.user.status === 'suspended') {
                            logout('suspended');
                            return;
                        }
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('linkcraft_user', JSON.stringify(data.user));
                        }
                    }
                }
            } catch {
                // Ignore transient network errors
            }
        };

        // 1. Initial check when page mounts or route changes
        verifyLiveSession();

        // 2. Tab focus / visibility change check
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                verifyLiveSession();
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        // 3. Storage event listener to sync logout across all open browser tabs
        const onStorageChange = (e) => {
            if (e.key === 'linkcraft_token' && !e.newValue) {
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
        };
        window.addEventListener('storage', onStorageChange);

        // 4. Realtime Server-Sent Events (SSE) stream for instant real-time suspension push
        const token = getAuthToken();
        if (token) {
            try {
                eventSource = new EventSource('/api/realtime');

                eventSource.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'USER_STATUS_CHANGED') {
                            const currentUser = getCurrentUser();
                            if (currentUser && data.userId === currentUser.id) {
                                if (data.status === 'suspended') {
                                    logout('suspended');
                                } else if (data.status) {
                                    currentUser.status = data.status;
                                    localStorage.setItem('linkcraft_user', JSON.stringify(currentUser));
                                }
                            }
                        }
                    } catch {
                        // ignore SSE parse errors
                    }
                };

                eventSource.onerror = () => {
                    // Browser EventSource automatically handles reconnection
                };
            } catch (sseErr) {
                console.warn('Realtime SSE connection failed in SessionWatcher:', sseErr);
            }
        }

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('storage', onStorageChange);
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [pathname]);

    return null;
}
