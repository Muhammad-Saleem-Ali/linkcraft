import { EventEmitter } from 'events';
import { parseAmazonUrl, AmazonProductInfo } from '@/utils/amazon';

export interface AffiliateLinkItem {
  id: string;
  partnerId: string;
  name: string;
  destinationUrl: string;
  affiliateUrl: string;
  shortSlug: string;
  shortUrl: string;
  showcaseUrl: string;
  country: string;
  views: number;
  clicks: number;
  rating: string;
  price?: string;
  originalPrice?: string;
  imageUrl?: string;
  asin?: string;
  features?: string[];
  status: 'active' | 'revoked';
  createdAt: string;
}

export interface UserPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionRate: number;
  currentlyOwed: number;
  lifetimeEarnings: number;
  totalPaidOut: number;
}

class BackendStore extends EventEmitter {
  private user: UserPartner = {
    id: 'usr_ahmar',
    name: 'Ahmar',
    email: 'hafizahmar050@gmail.com',
    phone: '+92 300 1234567',
    commissionRate: 0.70,
    currentlyOwed: 3530,
    lifetimeEarnings: 17579,
    totalPaidOut: 14049,
  };

  private links: Map<string, AffiliateLinkItem> = new Map([
    [
      'b08x123456',
      {
        id: 'lnk-1',
        partnerId: 'usr_ahmar',
        name: 'Men Women Custom Cotton T Shirts Personalized with P...',
        destinationUrl: 'https://www.amazon.com/dp/B08X123456',
        affiliateUrl: 'https://www.amazon.com/dp/B08X123456?tag=linkcraft-20',
        shortSlug: 'b08x123456',
        shortUrl: '/r/b08x123456',
        showcaseUrl: '/p/b08x123456',
        country: '🇺🇸',
        views: 45,
        clicks: 12,
        rating: '5.0 ★',
        price: '$24.99',
        originalPrice: '$29.99',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        asin: 'B08X123456',
        features: [
          '100% Premium Combed Cotton Soft Touch',
          'Customizable high-resolution digital print',
          'Pre-shrunk fabric suitable for machine wash'
        ],
        status: 'active',
        createdAt: '9/14/2026',
      },
    ],
    [
      'b08y987654',
      {
        id: 'lnk-2',
        partnerId: 'usr_ahmar',
        name: 'YASHINE Car Wash Foam Gun Kit for Garden Hose, Foam ...',
        destinationUrl: 'https://www.amazon.com/dp/B08Y987654',
        affiliateUrl: 'https://www.amazon.com/dp/B08Y987654?tag=ilearner-20',
        shortSlug: 'b08y987654',
        shortUrl: '/r/b08y987654',
        showcaseUrl: '/p/b08y987654',
        country: '🇺🇸',
        views: 28,
        clicks: 8,
        rating: '4.8 ★',
        price: '$34.50',
        originalPrice: '$42.00',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        asin: 'B08Y987654',
        features: [
          'Connects directly to standard garden hose',
          'Adjustable dial with 6 foam concentration ratios',
          'Brass connector fittings for zero leakage'
        ],
        status: 'active',
        createdAt: '9/14/2026',
      },
    ],
    [
      'b07z111222',
      {
        id: 'lnk-3',
        partnerId: 'usr_ahmar',
        name: 'JSELF 3 Inch Gel Memory Foam Mattress Topper, Dual-La...',
        destinationUrl: 'https://www.amazon.com/dp/B07Z111222',
        affiliateUrl: 'https://www.amazon.com/dp/B07Z111222?tag=ilearner-20',
        shortSlug: 'b07z111222',
        shortUrl: '/r/b07z111222',
        showcaseUrl: '/p/b07z111222',
        country: '🇺🇸',
        views: 89,
        clicks: 34,
        rating: '4.5 ★',
        price: '$89.99',
        originalPrice: '$119.99',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        asin: 'B07Z111222',
        features: [
          'Cooling gel-infused memory foam temperature regulation',
          'Ergonomic pressure relief for back & hip support',
          'Removable washable bamboo cover'
        ],
        status: 'active',
        createdAt: '9/14/2026',
      },
    ],
  ]);

  constructor() {
    super();
    this.setMaxListeners(100);
  }

  public getUser(): UserPartner {
    return { ...this.user };
  }

  public getAllLinks(): AffiliateLinkItem[] {
    return Array.from(this.links.values());
  }

  public getLinkBySlug(slug: string): AffiliateLinkItem | undefined {
    return this.links.get(slug.toLowerCase());
  }

  public createLink(data: { destinationUrl: string; customSlug?: string; name?: string; country?: string }): AffiliateLinkItem {
    const productInfo: AmazonProductInfo = parseAmazonUrl(data.destinationUrl);
    
    // Generate clean slug
    let rawSlug = data.customSlug || productInfo.asin.toLowerCase();
    rawSlug = rawSlug.replace(/[^a-z0-9-]/g, '-').slice(0, 30);
    if (!rawSlug) rawSlug = `link-${Date.now()}`;

    // Deduplicate slug if exists
    let slug = rawSlug;
    let counter = 1;
    while (this.links.has(slug)) {
      slug = `${rawSlug}-${counter}`;
      counter++;
    }

    const newLink: AffiliateLinkItem = {
      id: `lnk-${Date.now()}`,
      partnerId: this.user.id,
      name: data.name || productInfo.title,
      destinationUrl: data.destinationUrl,
      affiliateUrl: productInfo.affiliateUrl,
      shortSlug: slug,
      shortUrl: `/r/${slug}`,
      showcaseUrl: `/p/${slug}`,
      country: data.country || productInfo.country,
      views: 1,
      clicks: 0,
      rating: productInfo.rating,
      price: productInfo.price,
      originalPrice: productInfo.originalPrice,
      imageUrl: productInfo.imageUrl,
      asin: productInfo.asin,
      features: productInfo.features,
      status: 'active',
      createdAt: new Date().toLocaleDateString('en-US'),
    };

    this.links.set(slug, newLink);
    this.emit('realtime-event', { type: 'LINK_CREATED', link: newLink });
    return newLink;
  }

  public registerClick(slug: string): AffiliateLinkItem | undefined {
    const link = this.links.get(slug.toLowerCase());
    if (link && link.status === 'active') {
      link.views += 1;
      link.clicks += 1;
      this.user.currentlyOwed += 25; // Add Rs. 25 estimate per click
      this.links.set(slug.toLowerCase(), link);

      this.emit('realtime-event', {
        type: 'CLICK_REGISTERED',
        slug,
        link,
        updatedOwed: this.user.currentlyOwed,
      });
    }
    return link;
  }

  public revokeLink(slug: string): boolean {
    const link = this.links.get(slug.toLowerCase());
    if (link) {
      link.status = 'revoked';
      this.links.set(slug.toLowerCase(), link);
      this.emit('realtime-event', { type: 'LINK_REVOKED', slug });
      return true;
    }
    return false;
  }
}

// Global Singleton Store Instance
const globalStore = (global as any).__iLearnerStore || new BackendStore();
if (process.env.NODE_ENV !== 'production') {
  (global as any).__iLearnerStore = globalStore;
}

export default globalStore;
