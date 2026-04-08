import { v2 as cloudinary } from "cloudinary";

/**
 * Parameters the Upload Widget sends to be signed server-side.
 * Keep values in the same primitive types the widget uses so the signature matches.
 */
export type CloudinaryParamsToSign = Record<
  string,
  string | number | boolean
>;

let configured = false;

function ensureConfigured(): void {
  if (configured) return;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Faltan variables de entorno de Cloudinary: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  configured = true;
}

/**
 * Signature required by {@link https://next.cloudinary.dev/clduploadwidget/signed-uploads | CldUploadWidget} when using a signed upload preset.
 */
export function signCloudinaryUploadParams(
  paramsToSign: CloudinaryParamsToSign
): string {
  ensureConfigured();
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    throw new Error("CLOUDINARY_API_SECRET no está definida.");
  }
  return cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
}
