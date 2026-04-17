"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostImage {
  id: number;
  image_url: string;
  sort_order: number;
}

interface ImageViewerProps {
  images: PostImage[];
  className?: string;
}

export function ImageViewer({ images, className }: ImageViewerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Image Grid */}
      <div className={cn("grid gap-3", className)}>
        {images.length === 1 ? (
          <div
            className="relative aspect-video rounded-xl overflow-hidden cursor-zoom-in group"
            onClick={() => openLightbox(0)}
          >
            <img
              src={images[0].image_url}
              alt="帖子图片"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.slice(0, 6).map((image, index) => (
              <div
                key={image.id}
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden cursor-zoom-in group",
                  index === 0 && "col-span-2 row-span-2 aspect-auto"
                )}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.image_url}
                  alt={`帖子图片 ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay for zoom icon */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* More images indicator */}
                {index === 5 && images.length > 6 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      +{images.length - 6}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="关闭"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
            <span className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                aria-label="上一张"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                aria-label="下一张"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="relative max-w-4xl max-h-[85vh] mx-4">
            <img
              src={currentImage.image_url}
              alt={`图片 ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              style={{
                transform: `scale(1)`,
                transition: "transform 0.3s ease",
              }}
            />
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-white/10 backdrop-blur-sm max-w-[90vw] overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all",
                    currentIndex === index
                      ? "ring-2 ring-white scale-110"
                      : "opacity-50 hover:opacity-80"
                  )}
                >
                  <img
                    src={image.image_url}
                    alt={`缩略图 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard Navigation Hint */}
          <div className="absolute bottom-4 right-4 text-white/50 text-xs">
            按 ← → 键切换 · ESC 关闭
          </div>
        </div>
      )}
    </>
  );
}

// Image Placeholder for posts without images
export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center",
        className
      )}
    >
      <div className="text-center">
        <div className="text-5xl mb-2 opacity-50">📷</div>
        <p className="text-sm text-zinc-400">暂无图片</p>
      </div>
    </div>
  );
}
