import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export async function POST(request: Request) {
  try {
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
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar la solicitud. Intenta de nuevo.",
      },
      { status: 500 }
    );
  }
}
