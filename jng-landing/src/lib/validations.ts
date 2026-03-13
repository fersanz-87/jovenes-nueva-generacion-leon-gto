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
