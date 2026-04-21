import { z } from "zod/v4";

export const contactSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no debe exceder 100 caracteres"),
  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(20, "El teléfono no debe exceder 20 caracteres")
    .regex(/^[\d\s\-+()]+$/, "El teléfono solo debe contener números, espacios y guiones"),
  email: z
    .string()
    .email("El email no es válido")
    .optional()
    .or(z.literal("")),
  mensaje: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje no debe exceder 1000 caracteres"),
  _honeypot: z.string().max(0, "").optional(),
});

export type ContactFormInput = z.infer<typeof contactSchema>;

/**
 * Strip characters that could enable SMTP header injection.
 * Apply to any user-controlled value that may land in email headers
 * (subject, reply-to, display name in From, etc.).
 */
export function sanitizeEmailHeader(input: string): string {
  // Remove \r, \n, and all other control characters (U+0000–U+001F, U+007F)
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\r\n\x00-\x1f\x7f]/g, "").trim();
}
