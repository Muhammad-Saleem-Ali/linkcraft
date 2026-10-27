# LinkCraft - Amazon Affiliate Program Frontend

Modern, high-converting Amazon Associate product showcase builder, affiliate dashboard, and admin management console built with Next.js 16 and TypeScript.

---

## 🌟 Pages & Architecture

- **`/dashboard`**: Partner Affiliate Dashboard
  - Live earnings & currently owed balance
  - Interactive SVG performance charts (7-Day Trends, Monthly, Revenue, Top Products)
  - Earnings breakdown by month and country
  - Bank payouts history & downloadable receipts
  - Profile & WhatsApp bot pairing
- **`/admin`**: Master Admin Dashboard
  - **Overview**: Global platform KPIs, affiliate counts, gross sales, conversion rates
  - **Affiliates Management**: Searchable user table with live status controls (`active`, `pending`, `suspended`), commission rate modifiers, and inspect modals
  - **Reports & Revenue**: Month-by-month sales ledger, country performance (US, UK), and top revenue drivers with CSV export
  - **Payout Approvals**: Authorize affiliate bank payout transfers and issue transaction receipts
  - **Links Audit**: Global search and audit of all generated Amazon showcase pages
- **`/create`**: Link & Showcase Studio
  - Paste any Amazon product URL or ASIN
  - Select target marketplace (.com, .co.uk, .ca, .de, .in, .com.au)
  - Generate collision-free attribution tags and vanity slugs
  - Live table of generated showcase pages
- **`/p/[slug]`**: Hosted Shareable Product Showcase Page
  - High-converting product landing page with Prime badges, verified reviews, highlights
  - Direct Amazon Associates tracked purchase CTA
  - WhatsApp share and copy link utilities
  - Schema.org JSON-LD structured data for SEO
- **`/u/[username]`**: Partner Curated Storefront
  - Filterable by date (Today, Yesterday, This Week) and Country

---

## 🔗 Connection to Node.js Backend

All API calls (`/api/...`) and short redirect links (`/r/:slug`) are automatically proxied to the Node.js backend (`http://localhost:5000`) via Next.js rewrites configured in `next.config.ts`. All mock in-memory stores have been removed from the frontend.

---

## 🚀 Running the Frontend

```bash
# Start frontend development server
npm run dev

# Build for production
npm run build
npm start
```

Available at: `http://localhost:3000`
- Partner View: `http://localhost:3000/dashboard`
- Admin Console: `http://localhost:3000/admin`
- Studio: `http://localhost:3000/create`
