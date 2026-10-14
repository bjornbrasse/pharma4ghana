"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ImageIcon, Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { createImageVariants } from "@/lib/image-compression";

type ImageSelectorProps = {
  value?: Id<"image">;
  onChange: (imageId: Id<"image">, originalName: string, imageAlt?: string) => void;
  compact?: boolean;
};

export default function ImageSelector({ value, onChange, compact = false }: ImageSelectorProps) {
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const { isAuthenticated } = useConvexAuth();
  const images = useQuery(api.image.list, isAuthenticated ? {} : "skip");
  const generateUploadUrl = useMutation(api.image.generateUploadUrl);
  const createImage = useMutation(api.image.create);
  const updateImageAlt = useMutation(api.image.updateAlt);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadAlt, setUploadAlt] = useState("");
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>({});
  const [savingAltId, setSavingAltId] = useState<Id<"image"> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      trigger?.focus();
    };
  }, [open]);

  const selectedImage = images?.find((image) => image._id === value);
  const selectedThumbnail = selectedImage?.variants.find(
    (variant) => variant.purpose === "thumbnail",
  )?.url;

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const variants = await createImageVariants(file);
      const uploaded = await Promise.all(
        variants.map(async (variant) => {
          const uploadUrl = await generateUploadUrl({});
          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": variant.mimeType },
            body: variant.blob,
          });
          if (!response.ok) throw new Error("Uploaden naar Convex Storage is mislukt.");
          const result = (await response.json()) as { storageId: Id<"_storage"> };
          return {
            purpose: variant.purpose,
            storageId: result.storageId,
            width: variant.width,
            height: variant.height,
            bytes: variant.bytes,
            mimeType: variant.mimeType,
          };
        }),
      );
      const imageAlt = uploadAlt.trim();
      const imageId = await createImage({
        originalName: file.name,
        ...(imageAlt ? { imageAlt } : {}),
        variants: uploaded,
      });
      onChange(imageId, file.name, imageAlt || undefined);
      setUploadAlt("");
      setOpen(false);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Uploaden is mislukt.");
    } finally {
      setUploading(false);
    }
  }

  async function saveAlt(imageId: Id<"image">, currentAlt?: string) {
    const imageAlt = altDrafts[imageId] ?? currentAlt ?? "";
    setSavingAltId(imageId);
    setError(null);
    try {
      await updateImageAlt({ imageId, imageAlt });
      setAltDrafts((drafts) => {
        const next = { ...drafts };
        delete next[imageId];
        return next;
      });
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Opslaan is mislukt.");
    } finally {
      setSavingAltId(null);
    }
  }

  return (
    <>
      {compact ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-ghana-green hover:text-ghana-green"
        >
          <ImageIcon aria-hidden="true" className="size-4" />
          Afbeelding invoegen
        </button>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-28 w-full items-center gap-4 rounded-md border border-gray-300 bg-white p-3 text-left shadow-sm hover:border-ghana-green"
        >
          <span className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-md bg-gray-100 text-gray-400">
            {selectedThumbnail ? (
              <Image
                src={selectedThumbnail}
                alt={selectedImage?.imageAlt ?? ""}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <ImageIcon aria-hidden="true" className="size-7" />
            )}
          </span>
          <span>
            <span className="block text-sm font-semibold text-gray-900">
              {selectedImage?.originalName ?? "Kies een afbeelding"}
            </span>
            <span className="mt-1 block text-xs text-gray-500">Open de Image Explorer</span>
          </span>
        </button>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="animate-help-slide-in absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                Image Explorer
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Image Explorer sluiten"
                title="Sluiten"
                className="grid size-9 place-items-center rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </header>
            <div className="border-b border-gray-200 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex-1 text-sm font-semibold text-gray-800">
                  Beschrijving nieuwe afbeelding
                  <input
                    value={uploadAlt}
                    onChange={(event) => setUploadAlt(event.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-normal text-gray-900 shadow-sm focus:border-ghana-green focus:outline-none focus:ring-2 focus:ring-ghana-green/30"
                  />
                </label>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-ghana-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-ghana-green-dark">
                  <Upload aria-hidden="true" className="size-4" />
                  {uploading ? "Comprimeren en uploaden…" : "Afbeelding uploaden"}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void upload(file);
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
              {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {images === undefined ? (
                <p className="text-sm text-gray-500">Afbeeldingen laden…</p>
              ) : null}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {images?.map((image) => {
                  const thumbnail = image.variants.find(
                    (variant) => variant.purpose === "thumbnail",
                  );
                  return (
                    <div
                      key={image._id}
                      className={`overflow-hidden rounded-md border ${value === image._id ? "border-ghana-green ring-2 ring-ghana-green/30" : "border-gray-200"}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onChange(image._id, image.originalName, image.imageAlt);
                          setOpen(false);
                        }}
                        className="block w-full text-left hover:bg-gray-50"
                      >
                        <span className="relative block aspect-square bg-gray-100">
                          {thumbnail?.url ? (
                            <Image
                              src={thumbnail.url}
                              alt={image.imageAlt ?? ""}
                              fill
                              className="object-cover"
                              sizes="220px"
                            />
                          ) : null}
                        </span>
                        <span className="block truncate px-3 py-2 text-xs font-medium text-gray-700">
                          {image.originalName}
                        </span>
                      </button>
                      <div className="flex items-end gap-2 border-t border-gray-200 p-2">
                        <label className="min-w-0 flex-1 text-xs font-medium text-gray-700">
                          Alt-tekst
                          <input
                            value={altDrafts[image._id] ?? image.imageAlt ?? ""}
                            onChange={(event) =>
                              setAltDrafts((drafts) => ({
                                ...drafts,
                                [image._id]: event.target.value,
                              }))
                            }
                            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs font-normal text-gray-900 focus:border-ghana-green focus:outline-none focus:ring-2 focus:ring-ghana-green/30"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => void saveAlt(image._id, image.imageAlt)}
                          disabled={savingAltId === image._id}
                          aria-label={`Alt-tekst voor ${image.originalName} opslaan`}
                          title="Alt-tekst opslaan"
                          className="grid size-8 shrink-0 place-items-center rounded-md text-ghana-green hover:bg-green-50 disabled:opacity-50"
                        >
                          <Save aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
