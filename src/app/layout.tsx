import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06B6D4",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://linkcraft.dev"),
  title: {
    default: "LinkCraft | Amazon Product Showcase & Affiliate Link Generator",
    template: "%s | LinkCraft",
  },
  description:
    "LinkCraft helps Amazon Associates create professional, high-converting product showcase web pages and tracking links with collision detection, analytics, and instant WhatsApp sharing.",
  keywords: [
    "Amazon Associates",
    "Affiliate Link Generator",
    "Amazon Product Showcase",
    "Affiliate Marketing Engine",
    "Amazon Tracking Link",
    "LinkCraft",
    "Amazon Affiliate Tools",
  ],
  authors: [{ name: "LinkCraft Team", url: "https://linkcraft.dev" }],
  creator: "LinkCraft Platform",
  publisher: "LinkCraft",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://linkcraft.dev",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linkcraft.dev",
    siteName: "LinkCraft",
    title: "LinkCraft | Professional Amazon Product Showcase Generator",
    description:
      "Generate shareable Amazon product showcase pages and tracking links automatically with tracking ID collision detection.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "LinkCraft Amazon Product Showcase Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkCraft | Amazon Product Showcase & Affiliate Generator",
    description:
      "Create high-converting Amazon affiliate product pages & tracking links instantly.",
    creator: "@LinkCraft",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=630&fit=crop",
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "LinkCraft",
    url: "https://linkcraft.dev",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    description:
      "Professional Amazon Associate product showcase web page and tracking link generator platform.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
