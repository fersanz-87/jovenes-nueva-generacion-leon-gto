import type { NextConfig } from "next";

// Content Security Policy directives
// Shipped as Report-Only first — flip to Content-Security-Policy after 24h of clean reports in production.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self'",
  // Styles: 'unsafe-inline' needed because Next.js injects inline styles for font-display, layout, etc.
  // TODO: migrate to nonce-based CSP via middleware for stricter policy
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' res.cloudinary.com data: blob:",
  "media-src 'self' res.cloudinary.com",
  "font-src 'self'",
  "connect-src 'self' res.cloudinary.com",
  "frame-src www.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspDirectives,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
