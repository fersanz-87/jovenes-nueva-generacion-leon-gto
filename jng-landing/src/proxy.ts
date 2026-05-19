import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  generateCsrfToken,
  validateCsrfToken,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from "@/lib/csrf";

const PROTECTED_API_ROUTES = ["/api/contact"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Validate CSRF on mutating API requests
  if (
    request.method === "POST" &&
    PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    if (!validateCsrfToken(cookieToken, headerToken)) {
      return NextResponse.json(
        { success: false, message: "Solicitud inválida." },
        { status: 403 }
      );
    }
  }

  // Generate a fresh nonce per request for CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const isDev = process.env.NODE_ENV === "development";

  const cspDirectives = [
    "default-src 'self'",
    // 'unsafe-eval' required in dev: React 19 uses eval() for stack trace reconstruction.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // 'unsafe-inline' for styles: CSP nonces only cover <style> tags, not style attributes.
    // When a nonce is present, 'unsafe-inline' is ignored per spec — so we omit the nonce.
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
  ];

  const cspHeader = cspDirectives.join("; ");

  // Pass nonce to Next.js rendering via request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Set CSP on the response
  response.headers.set("Content-Security-Policy", cspHeader);

  // Set CSRF cookie on page navigations if not already present
  if (!request.cookies.has(CSRF_COOKIE_NAME)) {
    const token = generateCsrfToken();
    response.cookies.set(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // JS needs to read it
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pages and API routes; exclude static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
