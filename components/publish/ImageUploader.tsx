"use client";

import { useCallback, useState } from "react";
import imageCompression from "browser-image-compression";
import { Upload, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface UploadedImage {
  url: string;
  key: string;
  filename: string;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

interface UploadingItem {
  id: string;
  preview: string;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/webp" as const,
};

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
}: ImageUploaderProps) {
  const [uploadingItems, setUploadingItems] = useState<UploadingItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const compressAndUpload = useCallback(
    async (file: File): Promise<UploadedImage | null> => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const preview = URL.createObjectURL(file);

      // 添加到上传中列表
      setUploadingItems((prev) => [
        ...prev,
        { id, preview, progress: 0, status: "uploading" },
      ]);

      try {
        // 压缩图片
        setUploadingItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, progress: 10 } : item
          )
        );

        const compressedFile = await imageCompression(file, {
          ...COMPRESSION_OPTIONS,
          onProgress: (progress) => {
            setUploadingItems((prev) =>
              prev.map((item) =>
                item.id === id
                  ? { ...item, progress: Math.round(progress * 30) }
                  : item
              )
            );
          },
        });

        setUploadingItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, progress: 40 } : item
          )
        );

        // 上传到服务器
        const formData = new FormData();
        formData.append("file", compressedFile);

        const xhr = new XMLHttpRequest();

        return new Promise<UploadedImage | null>((resolve) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const progress = 40 + Math.round((e.loaded / e.total) * 60);
              setUploadingItems((prev) =>
                prev.map((item) =>
                  item.id === id ? { ...item, progress } : item
                )
              );
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              const result = JSON.parse(xhr.responseText);
              setUploadingItems((prev) =>
                prev.map((item) =>
                  item.id === id
                    ? { ...item, progress: 100, status: "success" }
                    : item
                )
              );
              URL.revokeObjectURL(preview);
              setTimeout(() => {
                setUploadingItems((prev) =>
                  prev.filter((item) => item.id !== id)
                );
              }, 500);
              resolve(result.data);
            } else {
              const result = JSON.parse(xhr.responseText);
              setUploadingItems((prev) =>
                prev.map((item) =>
                  item.id === id
                    ? { ...item, status: "error", error: result.error }
                    : item
                )
              );
              toast.error(result.error || "上传失败");
              resolve(null);
            }
          };

          xhr.onerror = () => {
            setUploadingItems((prev) =>
              prev.map((item) =>
                item.id === id
                  ? { ...item, status: "error", error: "网络错误" }
                  : item
              )
            );
            toast.error("网络错误，请稍后重试");
            resolve(null);
          };

          xhr.open("POST", "/api/upload");
          xhr.withCredentials = true;
          xhr.send(formData);
        });
      } catch (error) {
        console.error("Compression error:", error);
        setUploadingItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: "error", error: "压缩失败" }
              : item
          )
        );
        toast.error("图片压缩失败");
        URL.revokeObjectURL(preview);
        return null;
      }
    },
    []
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (disabled) return;

      const fileArray = Array.from(files);
      const remaining = maxImages - images.length;
      const filesToProcess = fileArray.slice(0, remaining);

      if (filesToProcess.length === 0) {
        toast.error(`最多只能上传 ${maxImages} 张图片`);
        return;
      }

      const imageFiles = filesToProcess.filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        toast.error("请选择图片文件");
        return;
      }

      const results = await Promise.all(
        imageFiles.map((file) => compressAndUpload(file))
      );

      const successfulUploads = results.filter(
        (result): result is UploadedImage => result !== null
      );

      if (successfulUploads.length > 0) {
        onImagesChange([...images, ...successfulUploads]);
      }
    },
    [images, maxImages, disabled, compressAndUpload, onImagesChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    },
    [images, onImagesChange]
  );

  const canAddMore = images.length < maxImages && !disabled;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {canAddMore && (
        <label
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
              : "border-zinc-300 dark:border-zinc-600 hover:border-blue-400 dark:hover:border-blue-500 bg-zinc-50 dark:bg-zinc-800/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            disabled={disabled}
          />

          <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
            {isDragging ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                <Upload className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {isDragging ? "释放以上传" : "拖拽图片或点击选择"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                自动压缩为 WebP 格式 (最多 {maxImages} 张)
              </p>
            </div>
          </div>
        </label>
      )}

      {/* Uploading Items */}
      {uploadingItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {uploadingItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"
            >
              <img
                src={item.preview}
                alt="上传中"
                className="w-full h-full object-cover opacity-50"
              />

              {/* Progress Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                {item.status === "uploading" && (
                  <>
                    <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                    <div className="w-16 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-200"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-white text-xs mt-1">
                      {item.progress}%
                    </span>
                  </>
                )}
                {item.status === "success" && (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                )}
                {item.status === "error" && (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              已上传图片 ({images.length}/{maxImages})
            </h3>
            {canAddMore && (
              <label className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer">
                继续添加
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  disabled={disabled}
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={image.key}
                className="relative group aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"
              >
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f5f5f5' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%23999' font-size='12'%3E加载失败%3C/text%3E%3C/svg%3E";
                  }}
                />

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Cover Badge */}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                    封面
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
