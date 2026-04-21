import { describe, it, expect } from "vitest";
import { generateCsrfToken, validateCsrfToken } from "@/lib/csrf";

describe("CSRF helpers", () => {
  describe("generateCsrfToken", () => {
    it("returns a 64-char hex string (32 bytes)", () => {
      const token = generateCsrfToken();
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    it("generates unique tokens", () => {
      const a = generateCsrfToken();
      const b = generateCsrfToken();
      expect(a).not.toBe(b);
    });
  });

  describe("validateCsrfToken", () => {
    it("returns true for matching tokens", () => {
      const token = generateCsrfToken();
      expect(validateCsrfToken(token, token)).toBe(true);
    });

    it("returns false when cookie is missing", () => {
      expect(validateCsrfToken(null, "some-token")).toBe(false);
      expect(validateCsrfToken(undefined, "some-token")).toBe(false);
    });

    it("returns false when header is missing", () => {
      expect(validateCsrfToken("some-token", null)).toBe(false);
      expect(validateCsrfToken("some-token", undefined)).toBe(false);
    });

    it("returns false for mismatched tokens", () => {
      const a = generateCsrfToken();
      const b = generateCsrfToken();
      expect(validateCsrfToken(a, b)).toBe(false);
    });

    it("returns false for different length tokens", () => {
      expect(validateCsrfToken("short", "a-much-longer-token")).toBe(false);
    });

    it("returns false for empty strings", () => {
      expect(validateCsrfToken("", "")).toBe(false);
    });
  });
});
