'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getCurrentUser } from '@/utils/auth';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = getAuthToken();
        const user = getCurrentUser();
        if (token && user) {
            if (user.role === 'admin') {
                router.replace('/admin');
            } else {
                router.replace('/dashboard');
            }
        } else {
            router.replace('/login');
        }
    }, [router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
        }}>
            <div style={{
                width: '36px',
                height: '36px',
                border: '3px solid #06B6D4',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />
        </div>
    );
}
