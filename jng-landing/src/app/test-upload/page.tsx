"use client";

import { useState } from "react";
import CloudinaryUploadWidget from "@/components/ui/CloudinaryUploadWidget";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";

interface UploadedAsset {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
}

export default function TestUploadPage() {
  const [uploaded, setUploaded] = useState<UploadedAsset | null>(null);

  function handleSuccess(result: CloudinaryUploadWidgetResults) {
    const info = result?.info;
    if (typeof info === "object" && info !== null) {
      setUploaded({
        publicId: info.public_id,
        secureUrl: info.secure_url,
        width: info.width,
        height: info.height,
      });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-3xl font-bold">Prueba de subida a Cloudinary</h1>

      <CloudinaryUploadWidget onSuccess={handleSuccess}>
        {({ open, isLoading }) => (
          <button
            type="button"
            onClick={() => open()}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Cargando widget…" : "Subir imagen"}
          </button>
        )}
      </CloudinaryUploadWidget>

      {uploaded && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-700 p-6">
          <p className="text-sm text-gray-400">
            <strong>public_id:</strong> {uploaded.publicId}
          </p>
          <CloudinaryImage
            publicId={uploaded.publicId}
            alt="Imagen subida"
            width={uploaded.width}
            height={uploaded.height}
            className="max-w-md rounded-lg"
          />
        </div>
      )}
    </main>
  );
}
