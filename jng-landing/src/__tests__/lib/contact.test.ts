import { describe, it, expect } from "vitest";
import {
  WHATSAPP_NUMBER,
  WHATSAPP_DEFAULT_MESSAGE,
  getWhatsAppUrl,
} from "@/lib/contact";

describe("contact lib", () => {
  describe("constants", () => {
    it("WHATSAPP_NUMBER is a valid format (digits only, no spaces)", () => {
      expect(WHATSAPP_NUMBER).toMatch(/^\d{10,15}$/);
    });

    it("WHATSAPP_DEFAULT_MESSAGE is a non-empty string", () => {
      expect(WHATSAPP_DEFAULT_MESSAGE.length).toBeGreaterThan(0);
    });
  });

  describe("getWhatsAppUrl", () => {
    it("returns a wa.me URL with the configured number", () => {
      const url = getWhatsAppUrl();
      expect(url).toContain(`https://wa.me/${WHATSAPP_NUMBER}`);
    });

    it("uses the default message when none is provided", () => {
      const url = getWhatsAppUrl();
      const encoded = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
      expect(url).toBe(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
      );
    });

    it("uses a custom message when provided", () => {
      const custom = "Necesito ayuda urgente";
      const url = getWhatsAppUrl(custom);
      const encoded = encodeURIComponent(custom);
      expect(url).toBe(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
      );
    });

    it("properly encodes special characters in the message", () => {
      const msg = "Hola! ¿Cómo están? Precio: $500 & más";
      const url = getWhatsAppUrl(msg);
      expect(url).toContain(encodeURIComponent(msg));
      expect(url).not.toContain("&más");
    });
  });
});
