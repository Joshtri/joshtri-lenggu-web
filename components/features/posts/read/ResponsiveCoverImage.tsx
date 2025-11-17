"use client";

import Image from "next/image";
import { useState } from "react";

interface ResponsiveCoverImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

interface ImageData {
  naturalWidth: number | undefined;
  naturalHeight: number | undefined;
}

export default function ResponsiveCoverImage({
  src,
  alt,
  priority = true,
}: ResponsiveCoverImageProps) {
  const [imageDimensions, setImageDimensions] = useState({
    width: 1024,
    height: 576,
  });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.naturalWidth && target.naturalHeight) {
      setImageDimensions({
        width: target.naturalWidth,
        height: target.naturalHeight,
      });
    }
  };

  // Calculate aspect ratio from image dimensions
  const aspectRatio = imageDimensions.width / imageDimensions.height;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div
        className="relative w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
        style={{
          aspectRatio: aspectRatio.toString(),
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 80vw, 1024px"
          onLoad={(result) => handleImageLoad(result)}
        />
      </div>
    </div>
  );
}
