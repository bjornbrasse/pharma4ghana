export type ImageVariantPurpose = "thumbnail" | "email" | "blog";

export type CompressedImageVariant = {
  purpose: ImageVariantPurpose;
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
  mimeType: string;
};

type VariantSpec = {
  purpose: ImageVariantPurpose;
  maxWidth: number;
  minWidth: number;
  maxBytes: number;
  minQuality: number;
  maxQuality: number;
  mimeType: "image/webp" | "image/jpeg";
};

const specs: VariantSpec[] = [
  {
    purpose: "thumbnail",
    maxWidth: 240,
    minWidth: 160,
    maxBytes: 15 * 1024,
    minQuality: 0.5,
    maxQuality: 0.85,
    mimeType: "image/webp",
  },
  {
    purpose: "email",
    maxWidth: 600,
    minWidth: 400,
    maxBytes: 150 * 1024,
    minQuality: 0.55,
    maxQuality: 1,
    mimeType: "image/jpeg",
  },
  {
    purpose: "blog",
    maxWidth: 1200,
    minWidth: 800,
    maxBytes: 150 * 1024,
    minQuality: 0.65,
    maxQuality: 1,
    mimeType: "image/webp",
  },
];

function encodeCanvas(canvas: HTMLCanvasElement, mimeType: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== mimeType) {
          reject(new Error(`De browser kan ${mimeType} niet encoderen.`));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

async function compressVariant(bitmap: ImageBitmap, spec: VariantSpec) {
  let targetWidth = Math.min(spec.maxWidth, bitmap.width);
  let fallback: CompressedImageVariant | null = null;

  while (targetWidth >= Math.min(spec.minWidth, bitmap.width)) {
    const scale = targetWidth / bitmap.width;
    const width = Math.max(1, Math.round(bitmap.width * Math.min(1, scale)));
    const height = Math.max(1, Math.round(bitmap.height * Math.min(1, scale)));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is niet beschikbaar.");

    if (spec.mimeType === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);

    let low = spec.minQuality;
    let high = spec.maxQuality;
    let best: Blob | null = null;
    for (let attempt = 0; attempt < 7; attempt += 1) {
      const quality = (low + high) / 2;
      const blob = await encodeCanvas(canvas, spec.mimeType, quality);
      if (blob.size <= spec.maxBytes) {
        best = blob;
        low = quality;
      } else {
        high = quality;
      }
    }

    const smallest = best ?? (await encodeCanvas(canvas, spec.mimeType, spec.minQuality));
    fallback = {
      purpose: spec.purpose,
      blob: smallest,
      width,
      height,
      bytes: smallest.size,
      mimeType: spec.mimeType,
    };
    if (smallest.size <= spec.maxBytes) return fallback;

    const nextWidth = Math.floor(targetWidth * 0.85);
    if (nextWidth < spec.minWidth || nextWidth === targetWidth) break;
    targetWidth = nextWidth;
  }

  if (!fallback) throw new Error("De afbeelding kon niet worden gecomprimeerd.");
  return fallback;
}

export async function createImageVariants(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Selecteer een afbeeldingsbestand.");
  const bitmap = await createImageBitmap(file);
  try {
    return await Promise.all(specs.map((spec) => compressVariant(bitmap, spec)));
  } finally {
    bitmap.close();
  }
}
