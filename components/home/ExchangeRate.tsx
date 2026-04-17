"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";

interface ExchangeRateData {
  rate: number;
  rateString: string;
  source: string;
  updatedAt: string;
}

const CACHE_KEY = "exchange_rate_cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1小时

export function ExchangeRate() {
  const [rateData, setRateData] = useState<ExchangeRateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchExchangeRate = useCallback(async (ignoreCache = false) => {
    try {
      // 如果不跳过缓存，先检查 localStorage
      if (!ignoreCache) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();

          // 如果缓存未过期，直接使用
          if (now - timestamp < CACHE_DURATION) {
            setRateData(data);
            setLoading(false);
            return;
          }
        }
      }

      // 从 API 获取（忽略缓存或缓存过期）
      const res = await fetch(`/api/exchange-rate?t=${Date.now()}`, {
        cache: "no-store"
      });
      if (!res.ok) {
        throw new Error("Failed to fetch exchange rate");
      }
      const json = await res.json();
      const data: ExchangeRateData = json.data;

      setRateData(data);

      // 存入 localStorage 缓存
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // 首次加载时直接获取（跳过缓存）
  useEffect(() => {
    fetchExchangeRate(true);
  }, [fetchExchangeRate]);

  // 显示逻辑：优先使用缓存的汇率，失败时显示默认值
  const displayRate = rateData?.rate || 7.24;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/50">
      <span className="text-sm">💱</span>
      <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400">
        今日汇率
      </span>
      <span className="text-xs sm:text-sm text-amber-600 dark:text-amber-500">
        1 USD = <span className="font-semibold">
          {loading ? "加载中..." : `${displayRate.toFixed(2)}`}
        </span> CNY
      </span>
      <button
        onClick={() => fetchExchangeRate(true)}
        disabled={loading}
        className="p-1 rounded hover:bg-amber-100/50 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50"
        aria-label="刷新汇率"
      >
        <RefreshCw
          className={`w-3 h-3 text-amber-400 ${loading ? "animate-spin" : ""}`}
          style={{ animationDuration: "3s" }}
        />
      </button>
      {error && (
        <span className="text-xs text-amber-500/60">(备用)</span>
      )}
    </div>
  );
}
