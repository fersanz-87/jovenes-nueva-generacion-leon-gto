import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = { limit: 5, windowMs: 60_000 } as const;

function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

export async function POST(request: Request) {
  try {
    // Rate limit by client IP
    const ip = getClientIp(request);
    const rl = await rateLimit(ip, RATE_LIMIT);

    if (!rl.ok) {
      const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          success: false,
          message: "Demasiadas solicitudes. Intenta de nuevo en un momento.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(Math.max(retryAfter, 1)) },
        }
      );
    }

    const body = await request.json();

    // Check honeypot
    if (body._honeypot) {
      // Silently reject bot submissions
      return NextResponse.json({
        success: true,
        message: "Mensaje enviado correctamente.",
      });
    }

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          message: firstError?.message || "Datos inválidos. Revisa el formulario.",
        },
        { status: 400 }
      );
    }

    const { nombre, telefono, email, mensaje } = result.data;

    // Sanitize inputs
    const sanitizedData = {
      nombre: sanitize(nombre),
      telefono: sanitize(telefono),
      email: email ? sanitize(email) : "",
      mensaje: sanitize(mensaje),
    };

    // TODO: Integrate email service (e.g., Resend, SendGrid, Nodemailer)
    // For now, log the contact submission
    console.log("Nuevo contacto recibido:", sanitizedData);

    return NextResponse.json({
      success: true,
      message:
        "¡Gracias por contactarnos! Nos comunicaremos contigo lo antes posible.",
    });
  } catch (error) {
    console.error("[contact] unexpected error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar la solicitud. Intenta de nuevo.",
      },
      { status: 500 }
    );
  }
}
