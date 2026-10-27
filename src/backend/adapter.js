import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { runMigrations } from './db/migrate.js';
import { seedDatabase } from './db/seed.js';

let dbInitialized = false;

async function ensureDbInit() {
    if (!dbInitialized && process.env.DATABASE_URL) {
        try {
            await runMigrations();
            await seedDatabase();
            dbInitialized = true;
        } catch (err) {
            console.warn('DB auto-initialization message:', err.message);
        }
    }
}

export async function handleApi(request, controllerFn, options = {}) {
    await ensureDbInit();

    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    let params = {};
    if (options.context && options.context.params) {
        params = await options.context.params;
    }

    const headersObj = {};
    request.headers.forEach((value, key) => {
        headersObj[key.toLowerCase()] = value;
    });

    let body = {};
    const method = request.method.toUpperCase();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        const contentType = headersObj['content-type'] || '';
        if (contentType.includes('application/json')) {
            try {
                body = await request.json();
            } catch {
                body = {};
            }
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
            try {
                const text = await request.text();
                const search = new URLSearchParams(text);
                body = Object.fromEntries(search.entries());
            } catch {
                body = {};
            }
        } else {
            try {
                body = await request.text();
            } catch {
                body = {};
            }
        }
    }

    // JWT verification
    let user = undefined;
    const authHeader = headersObj['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_ilearner_2026_xyz';
    if (token) {
        try {
            user = jwt.verify(token, JWT_SECRET);
        } catch {
            user = undefined;
        }
    }

    if (options.requireAuth && !user) {
        return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 });
    }

    if (options.requireAdmin && (!user || user.role !== 'admin')) {
        return NextResponse.json({ success: false, error: 'Admin access privileges required' }, { status: 403 });
    }

    const clientIp = headersObj['x-forwarded-for']?.split(',')[0]?.trim() || '127.0.0.1';

    const req = {
        method,
        url: request.url,
        headers: headersObj,
        query,
        params,
        body,
        user,
        ip: clientIp,
        socket: { remoteAddress: clientIp },
        get: (headerName) => headersObj[headerName.toLowerCase()],
    };

    let responseData = null;
    let responseStatus = 200;
    const responseHeaders = new Headers();

    const res = {
        status(code) {
            responseStatus = code;
            return res;
        },
        setHeader(name, val) {
            responseHeaders.set(name, val);
            return res;
        },
        json(data) {
            responseData = NextResponse.json(data, {
                status: responseStatus,
                headers: responseHeaders,
            });
            return responseData;
        },
        send(data) {
            responseData = new Response(data, {
                status: responseStatus,
                headers: responseHeaders,
            });
            return responseData;
        },
        redirect(targetUrl, code = 302) {
            try {
                const parsed = new URL(targetUrl, request.url);
                responseData = NextResponse.redirect(parsed.toString(), { status: code });
            } catch {
                responseData = new Response(null, {
                    status: code,
                    headers: { Location: targetUrl },
                });
            }
            return responseData;
        },
    };

    try {
        const result = await controllerFn(req, res);
        return responseData || result;
    } catch (err) {
        console.error('API Error in handler:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
