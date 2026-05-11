/**
 * Centralized contact configuration.
 *
 * Update WHATSAPP_NUMBER to change the WhatsApp target across the entire site.
 * Format: country code + number, no spaces or dashes (e.g. "524772631485").
 */

// WhatsApp
export const WHATSAPP_NUMBER = "524772631485" as const;

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola, me gustaría recibir información sobre el centro de rehabilitación." as const;

export function getWhatsAppUrl(message?: string): string {
  const encodedMessage = encodeURIComponent(message ?? WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

// Office phones — single source of truth for the entire site
export interface OfficePhone {
  readonly label: "Oficina" | "Móvil";
  readonly display: string;
  readonly href: string;
}

export const OFFICE_PHONES: readonly OfficePhone[] = [
  { label: "Oficina", display: "477 930 2775", href: "tel:+524779302775" },
  { label: "Móvil",   display: "720 265 5475", href: "tel:+527202655475" },
] as const;
