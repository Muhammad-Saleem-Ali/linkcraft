import crypto from 'crypto';
// Region and marketplace mappings for Amazon PA-API v5
const MARKETPLACE_CONFIG = {
    'www.amazon.com': {
        host: 'webservices.amazon.com',
        region: 'us-east-1',
        marketplace: 'www.amazon.com',
        countryFlag: '🇺🇸',
    },
    'www.amazon.co.uk': {
        host: 'webservices.amazon.co.uk',
        region: 'eu-west-1',
        marketplace: 'www.amazon.co.uk',
        countryFlag: '🇬🇧',
    },
    'www.amazon.ca': {
        host: 'webservices.amazon.ca',
        region: 'us-east-1',
        marketplace: 'www.amazon.ca',
        countryFlag: '🇨🇦',
    },
    'www.amazon.de': {
        host: 'webservices.amazon.de',
        region: 'eu-west-1',
        marketplace: 'www.amazon.de',
        countryFlag: '🇩🇪',
    },
    'www.amazon.in': {
        host: 'webservices.amazon.in',
        region: 'eu-west-1',
        marketplace: 'www.amazon.in',
        countryFlag: '🇮🇳',
    },
    'www.amazon.com.au': {
        host: 'webservices.amazon.com.au',
        region: 'us-west-2',
        marketplace: 'www.amazon.com.au',
        countryFlag: '🇦🇺',
    },
};
/**
 * AWS Signature Version 4 helper for PA-API v5
 */
function hmac(key, data) {
    return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}
function sha256Hex(data) {
    return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}
function getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = hmac('AWS4' + key, dateStamp);
    const kRegion = hmac(kDate, regionName);
    const kService = hmac(kRegion, serviceName);
    return hmac(kService, 'aws4_request');
}
export function isPaApiConfigured() {
    return Boolean(process.env.AMAZON_ACCESS_KEY &&
        process.env.AMAZON_SECRET_KEY &&
        process.env.AMAZON_PARTNER_TAG);
}
/**
 * Fetches real-time product details from Amazon Product Advertising API v5 (GetItems)
 */
export async function fetchProductFromPaApi(asin, domain = 'www.amazon.com', customAssociateTag) {
    const accessKey = process.env.AMAZON_ACCESS_KEY;
    const secretKey = process.env.AMAZON_SECRET_KEY;
    const partnerTag = customAssociateTag || process.env.AMAZON_PARTNER_TAG || 'linkcraft-20';
    if (!accessKey || !secretKey) {
        return null;
    }
    const market = MARKETPLACE_CONFIG[domain] || MARKETPLACE_CONFIG['www.amazon.com'];
    const host = market.host;
    const region = market.region;
    const marketplace = market.marketplace;
    const service = 'ProductAdvertisingAPI';
    const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems';
    const path = '/paapi5/getitems';
    const payloadObj = {
        ItemIds: [asin],
        Resources: [
            'ItemInfo.Title',
            'ItemInfo.Features',
            'Images.Primary.Large',
            'Offers.Listings.Price',
            'CustomerReviews.Count',
            'CustomerReviews.StarRating',
        ],
        PartnerTag: partnerTag,
        PartnerType: 'Associates',
        Marketplace: marketplace,
    };
    const payload = JSON.stringify(payloadObj);
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);
    const canonicalHeaders = `content-type:application/json; charset=utf-8\n` +
        `host:${host}\n` +
        `x-amz-date:${amzDate}\n` +
        `x-amz-target:${target}\n`;
    const signedHeaders = 'content-type;host;x-amz-date;x-amz-target';
    const payloadHash = sha256Hex(payload);
    const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${sha256Hex(canonicalRequest)}`;
    const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
    const signature = hmac(signingKey, stringToSign).toString('hex');
    const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    try {
        const response = await fetch(`https://${host}${path}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'host': host,
                'x-amz-date': amzDate,
                'x-amz-target': target,
                'Authorization': authorizationHeader,
            },
            body: payload,
        });
        if (!response.ok) {
            const errText = await response.text();
            console.warn(`Amazon PA-API returned HTTP ${response.status}: ${errText}`);
            return null;
        }
        const data = await response.json();
        const item = data?.ItemsResult?.Items?.[0];
        if (!item) {
            console.warn(`Amazon PA-API: No item found for ASIN ${asin}`);
            return null;
        }
        const title = item.ItemInfo?.Title?.DisplayValue || 'Amazon Featured Product';
        const imageUrl = item.Images?.Primary?.Large?.URL ||
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
        const priceAmount = item.Offers?.Listings?.[0]?.Price?.DisplayAmount || '$29.99';
        const numericPrice = parseFloat(priceAmount.replace(/[^0-9.]/g, '')) || 29.99;
        const origAmount = `$${(numericPrice * 1.25).toFixed(2)}`;
        const ratingVal = item.CustomerReviews?.StarRating?.Value;
        const rating = ratingVal ? `${ratingVal} ★` : '4.8 ★';
        const reviewsCount = item.CustomerReviews?.Count || 1200;
        const rawFeatures = item.ItemInfo?.Features?.DisplayValues;
        const features = Array.isArray(rawFeatures) && rawFeatures.length > 0
            ? rawFeatures.slice(0, 5)
            : [
                'Official Amazon Authentic Product',
                'Prime eligible fast and reliable shipping',
                'Covered by standard 30-day money-back guarantee',
            ];
        const affiliateUrl = item.DetailPageURL || `https://${domain}/dp/${asin}?tag=${partnerTag}`;
        return {
            asin: item.ASIN || asin,
            title,
            domain,
            country: market.countryFlag,
            affiliateUrl,
            imageUrl,
            price: priceAmount,
            originalPrice: origAmount,
            rating,
            reviewsCount,
            features,
        };
    }
    catch (error) {
        console.error('Error invoking Amazon PA-API:', error.message || error);
        return null;
    }
}
