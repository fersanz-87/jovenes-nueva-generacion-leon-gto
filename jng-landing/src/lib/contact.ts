/**
 * Centralized contact configuration.
 *
 * Update WHATSAPP_NUMBER to change the WhatsApp target across the entire site.
 * Format: country code + number, no spaces or dashes (e.g. "525567916346").
 */

export const WHATSAPP_NUMBER = "525567916346" as const;

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola, me gustaría recibir información sobre el centro de rehabilitación." as const;

export function getWhatsAppUrl(message?: string): string {
  const encodedMessage = encodeURIComponent(message ?? WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
