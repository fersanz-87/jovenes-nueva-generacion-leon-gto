import { randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_BYTES = 32;
export const CSRF_COOKIE_NAME = "csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";

export function generateCsrfToken(): string {
  return randomBytes(TOKEN_BYTES).toString("hex");
}

export function validateCsrfToken(
  cookieValue: string | undefined | null,
  headerValue: string | undefined | null
): boolean {
  if (!cookieValue || !headerValue) return false;
  if (cookieValue.length !== headerValue.length) return false;

  try {
    const a = Buffer.from(cookieValue, "utf-8");
    const b = Buffer.from(headerValue, "utf-8");
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
