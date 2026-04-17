"use client";

import { usePublishStore, PublishStep } from "@/store/publish-store";
import { Check, FolderOpen, FileText, Image } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "category" as PublishStep, label: "选择分类", icon: FolderOpen },
  { id: "info" as PublishStep, label: "填写信息", icon: FileText },
  { id: "images" as PublishStep, label: "上传图片", icon: Image },
];

export function StepIndicator() {
  const { step } = usePublishStore();

  const currentIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="w-full mb-8">
      {/* Mobile Stepper */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, index) => {
            const Icon = s.icon;
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <div key={s.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-blue-500 border-blue-500 text-white"
                      : isActive
                      ? "bg-white dark:bg-zinc-800 border-blue-500 text-blue-500"
                      : "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-12 h-0.5 mx-2 transition-all duration-300",
                      index < currentIndex
                        ? "bg-blue-500"
                        : "bg-zinc-300 dark:bg-zinc-600"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-center text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
          第 {currentIndex + 1} 步：{STEPS[currentIndex].label}
        </p>
      </div>

      {/* Desktop Progress Bar */}
      <div className="hidden sm:block">
        <div className="relative">
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
          
          {/* Progress Line */}
          <div
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />

          {/* Step Circles */}
          <div className="relative flex justify-between">
            {STEPS.map((s, index) => {
              const Icon = s.icon;
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <div key={s.id} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative z-10",
                      isCompleted
                        ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : isActive
                        ? "bg-white dark:bg-zinc-800 border-blue-500 text-blue-500 shadow-lg shadow-blue-500/20"
                        : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-3 text-sm font-medium transition-colors duration-300",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : isCompleted
                        ? "text-zinc-700 dark:text-zinc-300"
                        : "text-zinc-400 dark:text-zinc-500"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
