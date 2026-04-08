"use client";

import { CldImage } from "next-cloudinary";
import type { CldImageProps } from "next-cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

interface CloudinaryImageProps extends Omit<CldImageProps, "src"> {
  publicId: string;
  fallback?: React.ReactNode;
}

export default function CloudinaryImage({
  publicId,
  fallback,
  alt,
  ...props
}: CloudinaryImageProps) {
  if (!cloudName || !publicId) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <CldImage
      src={publicId}
      alt={alt}
      format="auto"
      quality="auto"
      {...props}
    />
  );
}
