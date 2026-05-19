import { Resend } from "resend";
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

function getResendFrom(): string {
  const from = process.env.RESEND_FROM;
  if (!from) {
    throw new Error("RESEND_FROM environment variable is not set.");
  }
  return from;
}

/**
 * Send a contact form submission email via Resend.
 *
 * When RESEND_API_KEY is not set (dev/test), logs the payload instead.
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

  const body = [
    `Nombre: ${payload.nombre}`,
    `Teléfono: ${payload.telefono}`,
    payload.email ? `Email: ${payload.email}` : null,
    "",
    payload.mensaje,
  ]
    .filter((line) => line !== null)
    .join("\n");

  if (!process.env.RESEND_API_KEY) {
    console.log("[email] RESEND_API_KEY not set, logging instead:", {
      to,
      subject,
      replyTo,
      body,
    });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = getResendFrom();

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    replyTo,
    text: body,
  });

  if (error) {
    // Log for debugging but do NOT leak to the client
    console.error("[email] Resend API error:", error.name, error.message);
    throw new Error("Email delivery failed");
  }

  console.log("[email] sent successfully to", to);
}
