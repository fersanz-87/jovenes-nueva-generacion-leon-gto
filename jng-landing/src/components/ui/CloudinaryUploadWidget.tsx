"use client";

import { CldUploadWidget } from "next-cloudinary";
import type {
  CloudinaryUploadWidgetOptions,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import { CLOUDINARY_UPLOAD_FOLDER } from "@/lib/cloudinary";

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadWidgetWrapperProps {
  children: (args: {
    open: () => void;
    isLoading: boolean;
    results?: CloudinaryUploadWidgetResults;
  }) => React.ReactNode;
  onSuccess?: (result: CloudinaryUploadWidgetResults) => void;
  options?: CloudinaryUploadWidgetOptions;
}

export default function CloudinaryUploadWidget({
  children,
  onSuccess,
  options,
}: CloudinaryUploadWidgetWrapperProps) {
  if (!uploadPreset) {
    console.warn(
      "CloudinaryUploadWidget: añade NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env (preset firmado en Cloudinary)."
    );
    return null;
  }

  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      uploadPreset={uploadPreset}
      options={{
        folder: CLOUDINARY_UPLOAD_FOLDER,
        ...options,
      }}
      onSuccess={(result) => onSuccess?.(result)}
    >
      {({ open, isLoading, results }) =>
        children({
          open,
          isLoading: Boolean(isLoading),
          results,
        })
      }
    </CldUploadWidget>
  );
}
