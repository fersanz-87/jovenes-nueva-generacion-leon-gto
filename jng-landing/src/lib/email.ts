import { sanitizeEmailHeader } from "@/lib/validations";

export interface ContactPayload {
  nombre: string;
  telefono: string;
  email: string;
  mensaje: string;
}

function getEmailTo(): string {
  const emailTo = process.env.EMAIL_TO;
  if (!emailTo) {
    throw new Error("EMAIL_TO environment variable is not set.");
  }
  return emailTo;
}

/**
 * Send a contact form submission email.
 *
 * This is a stub — wire in a transport (Resend, SendGrid, Nodemailer)
 * when ready. The function enforces structured input so raw SMTP
 * strings are never passed through.
 */
export async function sendContactEmail(
  payload: ContactPayload
): Promise<void> {
  const to = getEmailTo();
  const subject = sanitizeEmailHeader(
    `Nuevo contacto: ${payload.nombre}`
  );
  const replyTo = payload.email
    ? sanitizeEmailHeader(payload.email)
    : undefined;

  // TODO: Replace with actual email transport
  console.log("[email] would send:", {
    to,
    subject,
    replyTo,
    body: payload.mensaje,
    phone: payload.telefono,
  });
}
