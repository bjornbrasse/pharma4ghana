"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export default function ConvexImage({ imageId }: { imageId: string }) {
  const variant = useQuery(api.image.getVariant, {
    imageId: imageId as Id<"image">,
    purpose: "blog",
  });

  if (variant === undefined) {
    return <span className="my-8 block aspect-video animate-pulse rounded-3xl bg-gray-100" />;
  }

  if (variant === null) {
    return null;
  }

  return (
    <span className="my-8 block overflow-hidden rounded-3xl">
      <Image
        src={variant.url}
        alt={variant.imageAlt ?? ""}
        width={variant.width}
        height={variant.height}
        className="h-auto w-full object-cover"
        sizes="(max-width: 1024px) 100vw, 896px"
      />
    </span>
  );
}
