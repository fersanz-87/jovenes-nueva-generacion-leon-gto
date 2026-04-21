import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  generateCsrfToken,
  validateCsrfToken,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from "@/lib/csrf";

const PROTECTED_API_ROUTES = ["/api/contact"];

export function middleware(request: NextRequest) {
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

  // Set CSRF cookie on page navigations if not already present
  const response = NextResponse.next();

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
    // Match all pages and protected API routes
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
