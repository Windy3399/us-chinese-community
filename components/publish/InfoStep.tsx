"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePublishStore, INDUSTRIES, HOURLY_SALARY_RANGES, MONTHLY_SALARY_RANGES, WORK_TYPES, HOUSE_PRICE_RANGES, DEAL_PRICE_RANGES, US_STATES } from "@/store/publish-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Briefcase, Home, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const baseSchema = z.object({
  title: z.string().min(1, "请输入标题").max(100, "标题最多100个字符"),
  description: z.string().min(1, "请输入描述").max(2000, "描述最多2000个字符"),
  state: z.string().min(1, "请选择州"),
  city: z.string().min(1, "请输入城市"),
  phone: z.string().min(1, "请输入电话"),
  wechat: z.string().min(1, "请输入微信"),
});

const zhaopinSchema = baseSchema.extend({
  industry: z.string().min(1, "请选择行业"),
  salaryType: z.enum(["hourly", "monthly"]),
  hourlyRange: z.string().optional(),
  monthlyRange: z.string().optional(),
  workType: z.string().min(1, "请选择工作方式"),
});

const fangwuSchema = baseSchema.extend({
  priceRange: z.string().min(1, "请选择价格范围"),
});

const jiaoyiSchema = baseSchema.extend({
  priceRange: z.string().min(1, "请选择价格范围"),
});

type BaseFormData = z.infer<typeof baseSchema>;
type ZhaopinFormData = z.infer<typeof zhaopinSchema>;
type FangwuFormData = z.infer<typeof fangwuSchema>;
type JiaoyiFormData = z.infer<typeof jiaoyiSchema>;

function getCategoryIcon(slug: string | undefined) {
  switch (slug) {
    case "zhaopin":
      return <Briefcase className="w-5 h-5" />;
    case "fangwu":
      return <Home className="w-5 h-5" />;
    case "jiaoyi":
      return <ShoppingBag className="w-5 h-5" />;
    default:
      return null;
  }
}

export function InfoStep() {
  const {
    parentCategories,
    selectedParentId,
    selectedChildId,
    formData,
    updateFormData,
  } = usePublishStore();

  const selectedParent = parentCategories.find((c) => c.id === selectedParentId);
  const parentSlug = selectedParent?.slug;

  const defaultValues: BaseFormData = {
    title: formData.title,
    description: formData.description,
    state: formData.state || "",
    city: formData.city,
    phone: formData.phone,
    wechat: formData.wechat,
  };

  const useFormHook = useForm<BaseFormData>({
    resolver: zodResolver(baseSchema),
    defaultValues,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useFormHook;

  const onSubmit = (data: BaseFormData) => {
    updateFormData(data);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          填写信息
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          {selectedParent && (
            <span className="inline-flex items-center gap-2">
              {getCategoryIcon(parentSlug)}
              {selectedParent.name}
            </span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 通用字段 */}
        <div className="space-y-4">
          {/* 标题 */}
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="输入标题（最多100个字符）"
              maxLength={100}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 mb-2">
              <div className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-sm">
                  存储声明：所有内容从发布起保留1年，过期后系统自动物理删除。
                </p>
              </div>
            </div>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="详细描述您的信息（最多2000个字符）"
              maxLength={2000}
              rows={6}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* 州 */}
          <div className="space-y-2">
            <Label htmlFor="state">州</Label>
            <Select
              value={formData.state || ""}
              onValueChange={(value) => updateFormData({ state: value as any })}
            >
              <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                <SelectValue placeholder="选择州" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state.message}</p>
            )}
          </div>

          {/* 城市 */}
          <div className="space-y-2">
            <Label htmlFor="city">城市</Label>
            <Input
              id="city"
              {...register("city")}
              placeholder="输入城市名称"
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          {/* 电话 */}
          <div className="space-y-2">
            <Label htmlFor="phone">电话</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="输入联系电话"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* 微信 */}
          <div className="space-y-2">
            <Label htmlFor="wechat">微信</Label>
            <Input
              id="wechat"
              {...register("wechat")}
              placeholder="输入微信号"
              className={errors.wechat ? "border-red-500" : ""}
            />
            {errors.wechat && (
              <p className="text-sm text-red-500">{errors.wechat.message}</p>
            )}
          </div>
        </div>

        {/* 招聘额外字段 */}
        {parentSlug === "zhaopin" && (
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              招聘详情
            </h3>

            {/* 行业 */}
            <div className="space-y-2">
              <Label>行业</Label>
              <RadioGroup
                value={formData.industry || ""}
                onValueChange={(value) => updateFormData({ industry: value as any })}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"
              >
                {INDUSTRIES.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <RadioGroupItem value={industry} id={`industry-${industry}`} />
                    <Label htmlFor={`industry-${industry}`} className="font-normal cursor-pointer">
                      {industry}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 薪资类型 */}
            <div className="space-y-2">
              <Label>薪资类型</Label>
              <RadioGroup
                value={formData.salaryType || ""}
                onValueChange={(value) => updateFormData({ 
                  salaryType: value as "hourly" | "monthly",
                  hourlyRange: null,
                  monthlyRange: null,
                })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hourly" id="salary-hourly" />
                  <Label htmlFor="salary-hourly" className="font-normal cursor-pointer">
                    时薪
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="salary-monthly" />
                  <Label htmlFor="salary-monthly" className="font-normal cursor-pointer">
                    月薪
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 薪资范围 */}
            {formData.salaryType === "hourly" && (
              <div className="space-y-2">
                <Label>时薪范围</Label>
                <RadioGroup
                  value={formData.hourlyRange || ""}
                  onValueChange={(value) => updateFormData({ hourlyRange: value })}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-2"
                >
                  {HOURLY_SALARY_RANGES.map((range) => (
                    <div key={range.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={range.value} id={`hourly-${range.value}`} />
                      <Label htmlFor={`hourly-${range.value}`} className="font-normal cursor-pointer">
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {formData.salaryType === "monthly" && (
              <div className="space-y-2">
                <Label>月薪范围</Label>
                <RadioGroup
                  value={formData.monthlyRange || ""}
                  onValueChange={(value) => updateFormData({ monthlyRange: value })}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-2"
                >
                  {MONTHLY_SALARY_RANGES.map((range) => (
                    <div key={range.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={range.value} id={`monthly-${range.value}`} />
                      <Label htmlFor={`monthly-${range.value}`} className="font-normal cursor-pointer">
                        {range.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* 工作方式 */}
            <div className="space-y-2">
              <Label>工作方式</Label>
              <RadioGroup
                value={formData.workType || ""}
                onValueChange={(value) => updateFormData({ workType: value as any })}
                className="flex gap-4"
              >
                {WORK_TYPES.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.value} id={`worktype-${type.value}`} />
                    <Label htmlFor={`worktype-${type.value}`} className="font-normal cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}

        {/* 房屋额外字段 */}
        {parentSlug === "fangwu" && (
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Home className="w-5 h-5" />
              房屋详情
            </h3>

            {/* 价格范围 */}
            <div className="space-y-2">
              <Label>价格范围</Label>
              <RadioGroup
                value={formData.priceRange || ""}
                onValueChange={(value) => updateFormData({ priceRange: value })}
                className="grid grid-cols-2 lg:grid-cols-3 gap-2"
              >
                {HOUSE_PRICE_RANGES.map((range) => (
                  <div key={range.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={range.value} id={`house-${range.value}`} />
                    <Label htmlFor={`house-${range.value}`} className="font-normal cursor-pointer">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}

        {/* 交易额外字段 */}
        {parentSlug === "jiaoyi" && (
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              交易详情
            </h3>

            {/* 价格范围 */}
            <div className="space-y-2">
              <Label>价格</Label>
              <RadioGroup
                value={formData.priceRange || ""}
                onValueChange={(value) => updateFormData({ priceRange: value })}
                className="grid grid-cols-2 lg:grid-cols-3 gap-2"
              >
                {DEAL_PRICE_RANGES.map((range) => (
                  <div key={range.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={range.value} id={`deal-${range.value}`} />
                    <Label htmlFor={`deal-${range.value}`} className="font-normal cursor-pointer">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
