"use client";

import { usePublishStore } from "@/store/publish-store";
import { ImageUploader } from "@/components/publish/ImageUploader";

export function ImageStep() {
  const { formData, addImages, removeImage } = usePublishStore();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          上传图片
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          最多上传 5 张图片，自动压缩为 WebP 格式
        </p>
      </div>

      <ImageUploader
        images={formData.images}
        onImagesChange={(newImages) => {
          const currentCount = formData.images.length;
          const newCount = newImages.length;
          
          if (newCount > currentCount) {
            const added = newImages.slice(currentCount);
            addImages(added);
          } else if (newCount < currentCount) {
            for (let i = currentCount - 1; i >= newCount; i--) {
              removeImage(i);
            }
          }
        }}
        maxImages={5}
      />

      {formData.images.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            图片将随帖子一起上传
          </p>
        </div>
      )}
    </div>
  );
}
