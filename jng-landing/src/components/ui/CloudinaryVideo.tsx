"use client";

import dynamic from "next/dynamic";
import "next-cloudinary/dist/cld-video-player.css";

const CldVideoPlayer = dynamic(
  () => import("next-cloudinary").then((mod) => mod.CldVideoPlayer),
  { ssr: false }
);

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

interface CloudinaryVideoProps {
  publicId: string;
  width: number;
  height: number;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  fallback?: React.ReactNode;
  className?: string;
}

export default function CloudinaryVideo({
  publicId,
  width,
  height,
  autoPlay = true,
  loop = true,
  controls = false,
  fallback,
  className,
}: CloudinaryVideoProps) {
  if (!cloudName || !publicId) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div className={className}>
      <CldVideoPlayer
        src={publicId}
        width={width}
        height={height}
        autoplay={autoPlay ? "on-scroll" : undefined}
        loop={loop}
        controls={controls}
        muted
        sourceTypes={["webm/vp9", "mp4/h265", "mp4"]}
        transformation={{
          quality: "auto",
        }}
      />
    </div>
  );
}
