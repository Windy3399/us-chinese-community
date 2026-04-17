/**
 * Cron Worker - 每天 0:00 获取汇率数据并存入 KV
 */

interface Env {
  KV: KVNamespace;
}

const EXCHANGE_RATE_KEY = "exchange_rate_usd_cny";

// 主要 API: exchangerate-api.com
async function fetchFromPrimaryAPI(): Promise<{ rate: number; source: string } | null> {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    if (!response.ok) {
      throw new Error(`Primary API failed: ${response.status}`);
    }
    const data = await response.json();
    const rate = data.rates?.CNY;
    if (rate && rate > 6 && rate < 8) { // 合理范围检查
      return { rate, source: "exchangerate-api.com" };
    }
    return null;
  } catch (error) {
    console.error("Primary API error:", error);
    return null;
  }
}

// 备用 API 1: frankfurter.app
async function fetchFromFrankfurter(): Promise<{ rate: number; source: string } | null> {
  try {
    const response = await fetch("https://api.frankfurter.app/latest?from=USD&to=CNY");
    if (!response.ok) {
      throw new Error(`Frankfurter API failed: ${response.status}`);
    }
    const data = await response.json();
    const rate = data.rates?.CNY;
    if (rate && rate > 6 && rate < 8) {
      return { rate, source: "frankfurter.app" };
    }
    return null;
  } catch (error) {
    console.error("Frankfurter API error:", error);
    return null;
  }
}

// 备用 API 2: open.er-api.com
async function fetchFromOpenExchangeRates(): Promise<{ rate: number; source: string } | null> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) {
      throw new Error(`Open Exchange Rates API failed: ${response.status}`);
    }
    const data = await response.json();
    const rate = data.rates?.CNY;
    if (rate && rate > 6 && rate < 8) {
      return { rate, source: "open.er-api.com" };
    }
    return null;
  } catch (error) {
    console.error("Open Exchange Rates API error:", error);
    return null;
  }
}

async function fetchExchangeRate(): Promise<{ rate: number; source: string } | null> {
  // 按优先级尝试各个 API
  return (
    (await fetchFromPrimaryAPI()) ||
    (await fetchFromFrankfurter()) ||
    (await fetchFromOpenExchangeRates())
  );
}

export async function scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
  console.log("Cron triggered: Fetching exchange rate...");

  try {
    const result = await fetchExchangeRate();

    if (!result) {
      console.error("All exchange rate APIs failed");
      return;
    }

    const rateData = {
      rate: result.rate,
      rateString: result.rate.toFixed(4),
      source: result.source,
      updatedAt: new Date().toISOString()
    };

    // 存入 KV，24小时过期
    await env.KV.put(EXCHANGE_RATE_KEY, JSON.stringify(rateData), {
      expirationTtl: 86400
    });

    console.log(`Exchange rate updated: 1 USD = ${result.rate} CNY (${result.source})`);
  } catch (error) {
    console.error("Failed to update exchange rate:", error);
  }
}
