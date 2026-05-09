/**
 * Centralized contact configuration.
 *
 * Update these constants to change contact data across the entire site.
 * Format for phone numbers: country code + number, no spaces or dashes.
 */

// ── WhatsApp ────────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = "524772631485" as const;

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola, me gustaría recibir información sobre el centro de rehabilitación." as const;

export function getWhatsAppUrl(message?: string): string {
  const encodedMessage = encodeURIComponent(message ?? WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// ── Email de contacto ───────────────────────────────────────────────────────

export const CONTACT_EMAIL = "cromo181@gmail.com" as const;

// ── Teléfonos de oficina ────────────────────────────────────────────────────

export interface OfficePhone {
  readonly display: string;
  readonly href: string;
}

export const OFFICE_PHONES: readonly OfficePhone[] = [
  { display: "477 930 2775", href: "tel:+524779302775" },
  { display: "720 265 5475", href: "tel:+527202655475" },
] as const;
