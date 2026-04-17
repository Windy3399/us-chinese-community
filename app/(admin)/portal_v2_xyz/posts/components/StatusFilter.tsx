"use client";

// 类型定义
type StatusFilter = "all" | "pending" | "active" | "rejected";

interface StatusFilterProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

const options: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "pending", label: "待审核" },
  { value: "active", label: "已通过" },
  { value: "rejected", label: "已拒绝" },
];

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">状态：</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as StatusFilter)}
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}