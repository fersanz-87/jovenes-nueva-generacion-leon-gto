import { NextResponse } from "next/server";
import { z } from "zod";
import { signCloudinaryUploadParams } from "@/lib/cloudinary-server";

const bodySchema = z.object({
  paramsToSign: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()])
  ),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Cuerpo de solicitud inválido." },
        { status: 400 }
      );
    }

    const signature = signCloudinaryUploadParams(parsed.data.paramsToSign);

    return NextResponse.json({ signature });
  } catch (err) {
    console.error("[sign-cloudinary-params]", err);
    const message = err instanceof Error ? err.message : "";
    const isConfigError = message.includes("Cloudinary");
    return NextResponse.json(
      {
        error: isConfigError
          ? message
          : "No se pudo firmar los parámetros de subida.",
      },
      { status: 500 }
    );
  }
}
