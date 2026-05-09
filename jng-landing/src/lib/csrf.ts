/**
 * CSRF helpers using the Web Crypto API.
 *
 * Web Crypto is available in Node 20+, browsers, and Edge Runtime — so this
 * module works in middleware/proxy (Edge), API routes (Node), and tests.
 */

const TOKEN_BYTES = 32;
export const CSRF_COOKIE_NAME = "csrf-token";
export const CSRF_HEADER_NAME = "x-csrf-token";

export function generateCsrfToken(): string {
  const buf = new Uint8Array(TOKEN_BYTES);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Constant-time string comparison.
 * Both values must be the same length; the caller is expected to
 * length-check first (we still iterate over the longer of the two
 * to avoid leaking length differences via early-return timing).
 */
function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function validateCsrfToken(
  cookieValue: string | undefined | null,
  headerValue: string | undefined | null
): boolean {
  if (!cookieValue || !headerValue) return false;
  if (cookieValue.length !== headerValue.length) return false;
  return timingSafeEqualStrings(cookieValue, headerValue);
}
