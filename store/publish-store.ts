import { create } from "zustand";
import { Category, CategoryWithChildren } from "@/types";
import { UploadedImage } from "@/components/publish/ImageUploader";

export type PublishStep = "category" | "info" | "images";

export type PostCategory = "zhaopin" | "fangwu" | "jiaoyi";

export const CATEGORY_SLUGS = {
  zhaopin: "zhaopin",
  fangwu: "fangwu",
  jiaoyi: "jiaoyi",
} as const;

export const INDUSTRIES = [
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
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const HOURLY_SALARY_RANGES = [
  { value: "10-15", label: "$10-15/小时" },
  { value: "16-25", label: "$16-25/小时" },
  { value: "26-45", label: "$26-45/小时" },
  { value: "50-100", label: "$50-100/小时" },
] as const;

export const MONTHLY_SALARY_RANGES = [
  { value: "1700-2600", label: "$1700-2600/月" },
  { value: "2700-4300", label: "$2700-4300/月" },
  { value: "4500-7800", label: "$4500-7800/月" },
  { value: "8600-17000", label: "$8600-17000/月" },
] as const;

export const WORK_TYPES = [
  { value: "fulltime", label: "全职" },
  { value: "parttime", label: "兼职" },
  { value: "remote", label: "远程" },
] as const;

export const HOUSE_PRICE_RANGES = [
  { value: "0-500", label: "$0-500" },
  { value: "500-1K", label: "$500-1K" },
  { value: "1K-1.5K", label: "$1K-1.5K" },
  { value: "1.5K-2K", label: "$1.5K-2K" },
  { value: "2K-3K", label: "$2K-3K" },
  { value: "3K+", label: "$3K+" },
] as const;

export const DEAL_PRICE_RANGES = [
  { value: "free", label: "免费" },
  { value: "1-50", label: "$1-50" },
  { value: "51-200", label: "$51-200" },
  { value: "201-500", label: "$201-500" },
  { value: "501-1K", label: "$501-1K" },
  { value: "1K+", label: "$1K+" },
] as const;

export const US_STATES = [
  { value: "CA", label: "加利福尼亚州 California" },
  { value: "NY", label: "纽约州 New York" },
  { value: "TX", label: "德克萨斯州 Texas" },
  { value: "FL", label: "佛罗里达州 Florida" },
  { value: "IL", label: "伊利诺伊州 Illinois" },
  { value: "PA", label: "宾夕法尼亚州 Pennsylvania" },
  { value: "OH", label: "俄亥俄州 Ohio" },
  { value: "GA", label: "佐治亚州 Georgia" },
  { value: "NC", label: "北卡罗来纳州 North Carolina" },
  { value: "MI", label: "密歇根州 Michigan" },
  { value: "NJ", label: "新泽西州 New Jersey" },
  { value: "VA", label: "弗吉尼亚州 Virginia" },
  { value: "WA", label: "华盛顿州 Washington" },
  { value: "AZ", label: "亚利桑那州 Arizona" },
  { value: "MA", label: "马萨诸塞州 Massachusetts" },
  { value: "TN", label: "田纳西州 Tennessee" },
  { value: "IN", label: "印第安纳州 Indiana" },
  { value: "MO", label: "密苏里州 Missouri" },
  { value: "MD", label: "马里兰州 Maryland" },
  { value: "WI", label: "威斯康星州 Wisconsin" },
  { value: "CO", label: "科罗拉多州 Colorado" },
  { value: "MN", label: "明尼苏达州 Minnesota" },
  { value: "SC", label: "南卡罗来纳州 South Carolina" },
  { value: "AL", label: "阿拉巴马州 Alabama" },
  { value: "LA", label: "路易斯安那州 Louisiana" },
  { value: "KY", label: "肯塔基州 Kentucky" },
  { value: "OR", label: "俄勒冈州 Oregon" },
  { value: "OK", label: "俄克拉荷马州 Oklahoma" },
  { value: "CT", label: "康涅狄格州 Connecticut" },
  { value: "UT", label: "犹他州 Utah" },
  { value: "IA", label: "爱荷华州 Iowa" },
  { value: "NV", label: "内华达州 Nevada" },
  { value: "AR", label: "阿肯色州 Arkansas" },
  { value: "MS", label: "密西西比州 Mississippi" },
  { value: "KS", label: "堪萨斯州 Kansas" },
  { value: "NM", label: "新墨西哥州 New Mexico" },
  { value: "NE", label: "内布拉斯加州 Nebraska" },
  { value: "WV", label: "西弗吉尼亚州 West Virginia" },
  { value: "ID", label: "爱达荷州 Idaho" },
  { value: "HI", label: "夏威夷州 Hawaii" },
  { value: "NH", label: "新罕布什尔州 New Hampshire" },
  { value: "ME", label: "缅因州 Maine" },
  { value: "MT", label: "蒙大拿州 Montana" },
  { value: "RI", label: "罗德岛州 Rhode Island" },
  { value: "DE", label: "特拉华州 Delaware" },
  { value: "SD", label: "南达科他州 South Dakota" },
  { value: "ND", label: "北达科他州 North Dakota" },
  { value: "AK", label: "阿拉斯加州 Alaska" },
  { value: "DC", label: "华盛顿特区 Washington D.C." },
  { value: "VT", label: "佛蒙特州 Vermont" },
  { value: "WY", label: "怀俄明州 Wyoming" },
] as const;

export type USState = (typeof US_STATES)[number]["value"];

export interface PublishFormData {
  parentCategoryId: number | null;
  childCategoryId: number | null;
  title: string;
  description: string;
  state: USState | null;
  city: string;
  phone: string;
  wechat: string;
  industry: Industry | null;
  salaryType: "hourly" | "monthly" | null;
  hourlyRange: string | null;
  monthlyRange: string | null;
  workType: (typeof WORK_TYPES)[number]["value"] | null;
  priceRange: string | null;
  images: UploadedImage[];
}

interface PublishState {
  step: PublishStep;
  parentCategories: CategoryWithChildren[];
  childCategories: Category[];
  selectedParentId: number | null;
  selectedChildId: number | null;
  formData: PublishFormData;

  setStep: (step: PublishStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setParentCategories: (categories: CategoryWithChildren[]) => void;
  setChildCategories: (categories: Category[]) => void;
  selectParentCategory: (id: number | null) => void;
  selectChildCategory: (id: number | null) => void;
  updateFormData: (data: Partial<PublishFormData>) => void;
  addImages: (images: UploadedImage[]) => void;
  removeImage: (index: number) => void;
  reset: () => void;
}

const initialFormData: PublishFormData = {
  parentCategoryId: null,
  childCategoryId: null,
  title: "",
  description: "",
  state: null,
  city: "",
  phone: "",
  wechat: "",
  industry: null,
  salaryType: null,
  hourlyRange: null,
  monthlyRange: null,
  workType: null,
  priceRange: null,
  images: [],
};

export const usePublishStore = create<PublishState>((set, get) => ({
  step: "category",
  parentCategories: [],
  childCategories: [],
  selectedParentId: null,
  selectedChildId: null,
  formData: { ...initialFormData },

  setStep: (step) => set({ step }),

  nextStep: () => {
    const { step } = get();
    if (step === "category") set({ step: "info" });
    else if (step === "info") set({ step: "images" });
  },

  prevStep: () => {
    const { step } = get();
    if (step === "images") set({ step: "info" });
    else if (step === "info") set({ step: "category" });
  },

  setParentCategories: (parentCategories) => set({ parentCategories }),

  setChildCategories: (childCategories) => set({ childCategories }),

  selectParentCategory: (selectedParentId) => {
    const { parentCategories } = get();
    const parent = parentCategories.find((c) => c.id === selectedParentId);
    set({
      selectedParentId,
      selectedChildId: null,
      childCategories: parent?.children || [],
      formData: {
        ...get().formData,
        parentCategoryId: selectedParentId,
        childCategoryId: null,
        industry: null,
        salaryType: null,
        hourlyRange: null,
        monthlyRange: null,
        workType: null,
        priceRange: null,
      },
    });
  },

  selectChildCategory: (selectedChildId) => {
    const { selectedParentId } = get();
    set({
      selectedChildId,
      formData: {
        ...get().formData,
        childCategoryId: selectedChildId,
      },
    });
  },

  updateFormData: (data) =>
    set({ formData: { ...get().formData, ...data } }),

  addImages: (images: UploadedImage[]) => {
    const { formData } = get();
    const updatedImages = [...formData.images, ...images].slice(0, 5);
    set({ formData: { ...formData, images: updatedImages } });
  },

  removeImage: (index: number) => {
    const { formData } = get();
    const newImages = formData.images.filter((_, i) => i !== index);
    set({ formData: { ...formData, images: newImages } });
  },

  reset: () =>
    set({
      step: "category",
      selectedParentId: null,
      selectedChildId: null,
      childCategories: [],
      formData: { ...initialFormData, images: [] },
    }),
}));
