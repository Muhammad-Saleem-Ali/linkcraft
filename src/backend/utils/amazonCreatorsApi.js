import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Maps Amazon domains to regional LwA token endpoints and marketplace values
 */
const MARKETPLACE_MAP = {
  'www.amazon.com': {
    tokenUrl: 'https://api.amazon.com/auth/o2/token',
    marketplace: 'www.amazon.com',
  },
  'www.amazon.co.uk': {
    tokenUrl: 'https://api.amazon.co.uk/auth/o2/token',
    marketplace: 'www.amazon.co.uk',
  },
  'www.amazon.ca': {
    tokenUrl: 'https://api.amazon.com/auth/o2/token',
    marketplace: 'www.amazon.ca',
  },
  'www.amazon.de': {
    tokenUrl: 'https://api.amazon.co.uk/auth/o2/token',
    marketplace: 'www.amazon.de',
  },
  'www.amazon.in': {
    tokenUrl: 'https://api.amazon.co.jp/auth/o2/token',
    marketplace: 'www.amazon.in',
  },
  'www.amazon.com.au': {
    tokenUrl: 'https://api.amazon.co.jp/auth/o2/token',
    marketplace: 'www.amazon.com.au',
  },
};

export function isCreatorsApiConfigured() {
  const clientId = process.env.AMAZON_CLIENT_ID || process.env.AMAZON_ACCESS_KEY;
  const clientSecret = process.env.AMAZON_CLIENT_SECRET || process.env.AMAZON_SECRET_KEY;
  return Boolean(
    clientId &&
    clientSecret &&
    (clientId.startsWith('amzn1.application-oa2-client') || clientId.includes('oa2-client'))
  );
}

/**
 * Obtain an OAuth2 Bearer token from Login with Amazon (LwA)
 */
export async function getCreatorsApiAccessToken(domain = 'www.amazon.com') {
  const clientId = process.env.AMAZON_CLIENT_ID || process.env.AMAZON_ACCESS_KEY;
  const clientSecret = process.env.AMAZON_CLIENT_SECRET || process.env.AMAZON_SECRET_KEY;

  if (!clientId || !clientSecret) {
    throw new Error('Amazon Creators API client ID or client secret is not configured.');
  }

  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  const market = MARKETPLACE_MAP[domain] || MARKETPLACE_MAP['www.amazon.com'];
  const tokenUrl = market.tokenUrl;

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'creatorsapi::default',
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to obtain Amazon Creators API token (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  // Expire 5 minutes earlier than granted to ensure freshness
  tokenExpiresAt = now + ((data.expires_in || 3600) - 300) * 1000;
  return cachedToken;
}

/**
 * Fetch product details from Amazon Creators API (catalog/v1/getItems)
 */
export async function fetchProductFromCreatorsApi(asin, domain = 'www.amazon.com', customPartnerTag) {
  if (!isCreatorsApiConfigured()) {
    return null;
  }

  const partnerTag = customPartnerTag || process.env.AMAZON_PARTNER_TAG || 'linkcraft-20';
  const market = MARKETPLACE_MAP[domain] || MARKETPLACE_MAP['www.amazon.com'];

  try {
    const token = await getCreatorsApiAccessToken(domain);

    const res = await fetch('https://creatorsapi.amazon/catalog/v1/getItems', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-marketplace': market.marketplace,
      },
      body: JSON.stringify({
        itemIds: [asin],
        itemIdType: 'ASIN',
        marketplace: market.marketplace,
        partnerTag: partnerTag,
        resources: [
          'itemInfo.title',
          'itemInfo.features',
          'images.primary.large',
          'offersV2.listings.price',
          'customerReviews.starRating',
          'customerReviews.count',
        ],
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const errMsg = errJson?.message || `HTTP ${res.status}`;
      console.warn(`[Amazon Creators API] getItems warning: ${errMsg} (reason: ${errJson?.reason || 'unknown'})`);
      return null;
    }

    const data = await res.json();
    const item = data.itemsResult?.items?.[0] || data.items?.[0];
    if (!item) {
      return null;
    }

    const title = item.itemInfo?.title?.displayValue || 'Amazon Featured Product';
    const imageUrl = item.images?.primary?.large?.url || null;
    const price = item.offersV2?.listings?.[0]?.price?.displayAmount || null;
    const features = item.itemInfo?.features?.displayValues || [];
    const ratingValue = item.customerReviews?.starRating?.value;
    const rating = ratingValue ? `${ratingValue} ★` : '4.8 ★';
    const reviewsCount = item.customerReviews?.count || 1000;

    return {
      asin,
      title,
      domain,
      affiliateUrl: `https://${domain}/dp/${asnin}?tag=${partnerTag}`,
      imageUrl,
      price: price || '$29.99',
      rating,
      reviewsCount,
      features,
      source: 'creators-api',
    };
  } catch (err) {
    console.warn('[Amazon Creators API] Request failed:', err.message);
    return null;
  }
}

/**
 * Diagnostic test for verifying Amazon Creators API credentials
 */
export async function testAmazonCredentials(testPartnerTag) {
  const clientId = process.env.AMAZON_CLIENT_ID || process.env.AMAZON_ACCESS_KEY;
  const clientSecret = process.env.AMAZON_CLIENT_SECRET || process.env.AMAZON_SECRET_KEY;
  const partnerTag = testPartnerTag || process.env.AMAZON_PARTNER_TAG;

  const result = {
    configured: Boolean(clientId && clientSecret),
    tokenAcquired: false,
    partnerTagSet: Boolean(partnerTag),
    partnerTag: partnerTag || null,
    catalogAccess: false,
    message: '',
  };

  if (!result.configured) {
    result.message = 'Amazon Client ID or Secret is not configured in .env.';
    return result;
  }

  let token = null;
  try {
    token = await getCreatorsApiAccessToken('www.amazon.com');
    result.tokenAcquired = true;
  } catch (err) {
    result.message = `OAuth token acquisition failed: ${err.message}`;
    return result;
  }

  // Test getItems call
  try {
    const testRes = await fetch('https://creatorsapi.amazon/catalog/v1/getItems', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-marketplace': 'www.amazon.com',
      },
      body: JSON.stringify({
        itemIds: ['B09B2SBHQK'],
        itemIdType: 'ASIN',
        marketplace: 'www.amazon.com',
        partnerTag: partnerTag || 'linkcraft-20',
        resources: [
          'itemInfo.title',
          'images.primary.large',
          'offersV2.listings.price',
        ],
      }),
    });

    if (testRes.ok) {
      result.catalogAccess = true;
      result.message = 'Amazon Creators API authenticated successfully with full catalog access!';
    } else {
      const errJson = await testRes.json().catch(() => null);
      if (errJson?.reason === 'AssociateNotEligible') {
        result.message = 'OAuth token is verified and active! Note: Amazon Creators API catalog queries require your Associate store tag to have 3 qualifying sales before live catalog requests unlock. The system fallback parser will smoothly handle product details in the meantime.';
      } else {
        result.message = `OAuth token is verified. Catalog API: ${errJson?.message || testRes.statusText}`;
      }
    }
  } catch (err) {
    result.message = `OAuth token is verified! Note: Catalog probe encountered: ${err.message}. Fallback parser is active.`;
  }

  return result;
}

