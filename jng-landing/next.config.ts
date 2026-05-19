import type { NextConfig } from "next";

// Content Security Policy directives — enforced.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' https://challenges.cloudflare.com",
  // Styles: 'unsafe-inline' needed because Next.js injects inline styles for font-display, layout, etc.
  // TODO: migrate to nonce-based CSP via middleware for stricter policy
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' res.cloudinary.com data: blob:",
  "media-src 'self' res.cloudinary.com",
  "font-src 'self'",
  "connect-src 'self' res.cloudinary.com https://challenges.cloudflare.com",
  "frame-src www.google.com https://challenges.cloudflare.com",
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
            key: "Content-Security-Policy",
            value: cspDirectives,
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
