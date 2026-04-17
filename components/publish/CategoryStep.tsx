"use client";

import { useEffect } from "react";
import { usePublishStore } from "@/store/publish-store";
import { cn } from "@/lib/utils";

export function CategoryStep() {
  const {
    parentCategories,
    childCategories,
    selectedParentId,
    selectedChildId,
    setParentCategories,
    selectParentCategory,
    selectChildCategory,
  } = usePublishStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          const filtered = data.data.filter(
            (cat: { is_admin_only: number }) => cat.is_admin_only !== 1
          );
          setParentCategories(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [setParentCategories]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          选择分类
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          选择你要发布的帖子类型
        </p>
      </div>

      {/* Parent Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parentCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => selectParentCategory(category.id)}
            className={cn(
              "relative p-6 rounded-xl border-2 transition-all duration-200 text-left",
              "hover:shadow-lg hover:-translate-y-0.5",
              selectedParentId === category.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-blue-200 dark:shadow-blue-900/20"
                : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-blue-300 dark:hover:border-blue-600"
            )}
          >
            <div className="flex items-center gap-3">
              {category.icon && (
                <span className="text-2xl">{category.icon}</span>
              )}
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {category.name}
                </div>
                {category.children.length > 0 && (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {category.children.length} 个子分类
                  </div>
                )}
              </div>
            </div>
            {selectedParentId === category.id && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Child Categories - 行业黄页特殊处理 */}
      {selectedParentId && childCategories.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            选择子分类
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {childCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => selectChildCategory(category.id)}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 text-center",
                  selectedChildId === category.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-blue-300 dark:hover:border-blue-600"
                )}
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 行业黄页 - 17个行业单选 */}
      {parentCategories.find((c) => c.id === selectedParentId)?.slug ===
        "hangye" && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            选择行业
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              "餐饮/食品",
              "超市/零售",
              "物流/仓储",
              "建筑/装修",
              "美容/按摩",
              "教育/培训",
              "IT/科技",
              "金融/保险",
              "医疗/健康",
              "旅游/酒店",
              "制造/加工",
              "翻译/文案",
              "法律/会计",
              "销售/市场",
              "行政/人事",
              "其他行业",
            ].map((industry) => (
              <button
                key={industry}
                onClick={() => {
                  selectChildCategory(-1);
                  usePublishStore.getState().updateFormData({ industry: industry as any });
                }}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 text-center",
                  usePublishStore.getState().formData.industry === industry
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 ring-2 ring-amber-500/20"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-amber-300 dark:hover:border-amber-600"
                )}
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {industry}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
