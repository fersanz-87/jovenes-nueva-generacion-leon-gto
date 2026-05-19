import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";

const RATE_LIMIT = { limit: 5, windowMs: 60_000 } as const;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Turnstile not configured — skip verification (dev/test)
    return true;
  }

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data: TurnstileVerifyResponse = await res.json();
  console.log("[turnstile] verify result:", {
    success: data.success,
    errors: data["error-codes"],
  });
  return data.success;
}

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

    // Verify Turnstile token (when configured)
    const turnstileToken =
      typeof body["cf-turnstile-response"] === "string"
        ? body["cf-turnstile-response"]
        : "";
    const turnstileOk = await verifyTurnstile(turnstileToken);
    if (!turnstileOk) {
      return NextResponse.json(
        {
          success: false,
          message: "No pudimos verificar tu solicitud.",
        },
        { status: 400 }
      );
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

    await sendContactEmail(sanitizedData);

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
