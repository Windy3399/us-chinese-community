import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_URL = "https://api.frankfurter.app/latest?from=USD&to=CNY";

interface ExternalRateData {
  amount: number;
  base: string;
  date: string;
  rates: {
    CNY: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    // 从外部 API 获取真实汇率
    const response = await fetch(EXTERNAL_API_URL, {
      next: { revalidate: 3600 } // 缓存 1 小时
    });

    if (!response.ok) {
      throw new Error(`External API returned ${response.status}`);
    }

    const data: ExternalRateData = await response.json();
    const rate = data.rates.CNY;

    // 如果汇率获取成功且在合理范围内（6.5-8.5），返回真实数据
    if (rate && rate > 6.5 && rate < 8.5) {
      return NextResponse.json({
        data: {
          rate: parseFloat(rate.toFixed(2)),
          rateString: rate.toFixed(2),
          source: "Frankfurter API",
          updatedAt: new Date().toISOString(),
          apiDate: data.date
        }
      });
    }

    // 汇率异常，返回降级数据
    throw new Error(`Rate ${rate} out of reasonable range`);
  } catch (error) {
    console.error("Failed to fetch exchange rate from external API:", error);

    // 降级：尝试从 Cloudflare KV 读取缓存
    const env = (request as any).env as { KV?: { get: (key: string) => Promise<string | null> } };
    if (env?.KV) {
      try {
        const cachedRate = await env.KV.get("exchange_rate_usd_cny");
        if (cachedRate) {
          const rateData = JSON.parse(cachedRate);
          return NextResponse.json({
            data: rateData,
            source: "KV Cache",
            timestamp: new Date().toISOString()
          });
        }
      } catch (kvError) {
        console.error("Failed to read from KV:", kvError);
      }
    }

    // 最终降级：返回估算汇率（带标记）
    const fallbackRate = 7.24;
    return NextResponse.json({
      data: {
        rate: fallbackRate,
        rateString: fallbackRate.toFixed(2),
        source: "备用数据（API不可用）",
        updatedAt: new Date().toISOString()
      },
      warning: "使用备用汇率，请检查网络连接"
    });
  }
}
