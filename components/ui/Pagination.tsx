"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const dots = "...";

  const fetchPageNumbers = () => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 3 + siblingCount);
      return [...leftRange, dots, totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (2 + siblingCount), totalPages);
      return [1, dots, ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, dots, ...middleRange, dots, totalPages];
    }

    return range(1, totalPages);
  };

  const pages = fetchPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="分页导航"
    >
      {/* First Page */}
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        aria-label="第一页"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>

      {/* Previous Page */}
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="上一页"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === dots) {
            return (
              <span
                key={`dots-${index}`}
                className="px-2 text-zinc-400"
              >
                {dots}
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              variant={isActive ? "default" : "ghost"}
              size="icon"
              className={cn(
                "w-9 h-9",
                isActive && "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-0"
              )}
              onClick={() => onPageChange(page as number)}
              aria-label={`第 ${page} 页`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next Page */}
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="下一页"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        aria-label="最后一页"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </nav>
  );
}

// Simple pagination info display
export function PaginationInfo({
  currentPage,
  totalPages,
  total,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
}) {
  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
      共 <span className="font-medium text-zinc-700 dark:text-zinc-300">{total}</span> 条结果，
      第 <span className="font-medium text-zinc-700 dark:text-zinc-300">{currentPage}</span>/{totalPages} 页
    </p>
  );
}
