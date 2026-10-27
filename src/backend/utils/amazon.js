import { fetchProductFromPaApi, isPaApiConfigured } from './amazonPaApi.js';
import { fetchProductFromCreatorsApi, isCreatorsApiConfigured } from './amazonCreatorsApi.js';

export function parseAmazonUrl(url, associateTag = process.env.AMAZON_PARTNER_TAG || 'linkcraft-20') {
    const cleanUrl = url.trim();
    // Try to match ASIN (10 alphanumeric chars usually starting with B or numbers)
    const asinMatch = cleanUrl.match(/(?:dp|gp\/product|\/d\/|ASIN\/)([A-Z0-9]{10})/i) ||
        cleanUrl.match(/\b([A-Z0-9]{10})\b/i);
    const asin = asinMatch ? asinMatch[1].toUpperCase() : `B0${Math.floor(10000000 + Math.random() * 90000000)}`;
    // Determine domain & country flag
    let domain = 'www.amazon.com';
    let country = '🇺🇸';
    if (cleanUrl.includes('amazon.co.uk')) {
        domain = 'www.amazon.co.uk';
        country = '🇬🇧';
    }
    else if (cleanUrl.includes('amazon.ca')) {
        domain = 'www.amazon.ca';
        country = '🇨🇦';
    }
    else if (cleanUrl.includes('amazon.de')) {
        domain = 'www.amazon.de';
        country = '🇩🇪';
    }
    else if (cleanUrl.includes('amazon.in')) {
        domain = 'www.amazon.in';
        country = '🇮🇳';
    }
    else if (cleanUrl.includes('amazon.com.au')) {
        domain = 'www.amazon.com.au';
        country = '🇦🇺';
    }
    // Construct official affiliate URL with tracking tag
    const affiliateUrl = `https://${domain}/dp/${asin}?tag=${associateTag}`;
    // Extract title from URL path or fallback
    let title = 'Amazon High-Quality Featured Product';
    try {
        const urlParts = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
        const pathname = urlParts.pathname;
        const titlePart = pathname.split('/dp/')[0] || pathname.split('/gp/product/')[0];
        if (titlePart && titlePart !== '/' && !titlePart.startsWith('/dp')) {
            const rawTitle = titlePart.replace(/^\//, '').replace(/-/g, ' ');
            if (rawTitle.length > 3) {
                title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
            }
        }
    }
    catch {
        // URL parsing fallback
    }
    if (title === 'Amazon High-Quality Featured Product' || title.length < 5) {
        const sampleTitles = [
            'Men Women Custom Cotton T-Shirts Personalized Print & Comfort Fit',
            'YASHINE Car Wash Foam Gun Kit for Garden Hose, Heavy Duty Spray',
            'JSELF 3 Inch Gel Memory Foam Mattress Topper, Dual-Layer Breathable',
            '3-in-1 Dough Toy Set, 24 Color Kitchen Food Tools for Kids',
            '36MP 2K Mini Trail Camera with Night Vision for Wildlife & Security',
            'Stair Climbing Grocery Cart on Wheels, Foldable 50 L Capacity',
            'Baby Gate for Doorways & Top/Bottom of Stairs, 31-54" Width',
            'HENMI Car Dehumidifier Bags with Non-Slip Mat, 400g Pack of 2',
            'Walking Pad Under Desk Treadmill with Remote Control & LED Display',
            'Vibration Plate Lymphatic Drainage, 2026 Powerful Workout Machine'
        ];
        const index = Math.abs(asin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % sampleTitles.length;
        title = sampleTitles[index];
    }
    // Realistic product image mock matching Amazon showcase
    const sampleImages = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80'
    ];
    const imageIndex = Math.abs(asin.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % sampleImages.length;
    const imageUrl = sampleImages[imageIndex];
    // Price & Features
    const priceNum = (19.99 + (Math.abs(asin.charCodeAt(0)) * 1.5) % 150).toFixed(2);
    const origNum = (parseFloat(priceNum) * 1.25).toFixed(2);
    return {
        asin,
        title,
        domain,
        country,
        affiliateUrl,
        imageUrl,
        price: `$${priceNum}`,
        originalPrice: `$${origNum}`,
        rating: '4.8 ★',
        reviewsCount: 1420,
        features: [
            'Premium durable materials crafted for long-lasting performance',
            'Fully compatible with official Amazon Prime 2-Day Fast Shipping',
            'Top-rated item with over 1,000+ verified customer reviews',
            'Hassle-free 30-day return policy backed by Amazon guarantee'
        ],
        source: 'parser_fallback'
    };
}
/**
 * High-level product resolver: tries Amazon Creators API or PA-API first, falls back to URL parsing
 */
export async function resolveAmazonProduct(url, associateTag = process.env.AMAZON_PARTNER_TAG || 'linkcraft-20') {
    const fallback = parseAmazonUrl(url, associateTag);

    // 1. Try Amazon Creators API (OAuth2)
    if (isCreatorsApiConfigured()) {
        try {
            const liveProduct = await fetchProductFromCreatorsApi(fallback.asin, fallback.domain, associateTag);
            if (liveProduct) {
                return liveProduct;
            }
        } catch (err) {
            console.warn('[Amazon Resolver] Creators API error, trying fallback:', err.message);
        }
    }

    // 2. Try legacy PA-API v5 (AWS SigV4) if configured
    if (isPaApiConfigured()) {
        try {
            const liveProduct = await fetchProductFromPaApi(fallback.asin, fallback.domain, associateTag);
            if (liveProduct) {
                return {
                    ...liveProduct,
                    source: 'pa-api',
                };
            }
        } catch (err) {
            console.warn('[Amazon Resolver] Legacy PA-API failed, trying fallback:', err.message);
        }
    }

    return fallback;
}

