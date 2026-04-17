"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { usePublishStore } from "@/store/publish-store";
import { StepIndicator } from "@/components/publish/StepIndicator";
import { CategoryStep } from "@/components/publish/CategoryStep";
import { InfoStep } from "@/components/publish/InfoStep";
import { ImageStep } from "@/components/publish/ImageStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PublishPage() {
  const router = useRouter();
  const { user, isHydrated, fetchUser } = useAuthStore();
  const {
    step,
    selectedParentId,
    selectedChildId,
    parentCategories,
    formData,
    nextStep,
    prevStep,
    reset,
  } = usePublishStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      fetchUser();
    }
  }, [isHydrated, fetchUser]);

  useEffect(() => {
    if (isHydrated && !user) {
      toast.error("请先登录");
      router.push("/login?redirect=/publish");
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const canProceed = () => {
    switch (step) {
      case "category":
        if (selectedParentId === null) return false;
        const parent = parentCategories.find((c) => c.id === selectedParentId);
        if (!parent) return false;
        if (parent.slug === "hangye") {
          return formData.industry !== null;
        }
        return selectedChildId !== null;
      case "info":
        return true;
      case "images":
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      if (step === "category") {
        const parent = parentCategories.find((c) => c.id === selectedParentId);
        if (parent?.slug === "hangye") {
          toast.error("请选择行业");
        } else {
          toast.error("请选择分类");
        }
        return;
      }
    }
    nextStep();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const parent = parentCategories.find((c) => c.id === selectedParentId);
      const categoryId =
        parent?.slug === "hangye" ? selectedParentId : selectedChildId;

      // 构建 extraFields
      const extraFields: Record<string, unknown> = {};
      if (parent?.slug === "zhaopin") {
        if (formData.industry) extraFields.industry = formData.industry;
        if (formData.salaryType) extraFields.salaryType = formData.salaryType;
        if (formData.hourlyRange) extraFields.hourlyRange = formData.hourlyRange;
        if (formData.monthlyRange) extraFields.monthlyRange = formData.monthlyRange;
        if (formData.workType) extraFields.workType = formData.workType;
      } else if (parent?.slug === "fangwu" || parent?.slug === "jiaoyi") {
        if (formData.priceRange) extraFields.priceRange = formData.priceRange;
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          categoryId,
          title: formData.title,
          description: formData.description,
          state: formData.state,
          city: formData.city,
          phone: formData.phone,
          wechat: formData.wechat,
          extraFields,
          images: formData.images.map((img) => img.url),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "发布失败");
        return;
      }

      toast.success("🎉 发布成功，等待审核");
      reset();
      router.push("/");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("网络错误，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "category":
        return <CategoryStep />;
      case "info":
        return <InfoStep />;
      case "images":
        return <ImageStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          发布信息
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          填写您的信息，分享给社区
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator />

      {/* Form Container */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 p-6 sm:p-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === "category" || isSubmitting}
          className={cn(
            "flex items-center gap-2 h-12 px-6 rounded-xl border-2 transition-all duration-200",
            "border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          上一步
        </Button>

        {step === "images" ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-2 h-12 px-8 rounded-xl",
              "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
              "shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
              "font-medium transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                提交中...
              </>
            ) : (
              "提交发布"
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className={cn(
              "flex items-center gap-2 h-12 px-8 rounded-xl",
              "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
              "shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
              "font-medium transition-all duration-200"
            )}
          >
            下一步
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 mt-8">
        遇到问题？联系客服获得帮助
      </p>
    </div>
  );
}