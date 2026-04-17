"use client";

interface BulkActionBarProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  onClear: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onApprove,
  onReject,
  onClear,
}: BulkActionBarProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
      <span className="text-sm text-blue-700">
        已选择 <strong>{selectedCount}</strong> 条帖子
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onApprove}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
        >
          ✅ 批量通过
        </button>
        <button
          onClick={onReject}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
        >
          ❌ 批量拒绝
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
        >
          取消选择
        </button>
      </div>
    </div>
  );
}