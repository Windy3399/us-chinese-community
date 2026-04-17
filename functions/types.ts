import type { KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  KV: KVNamespace;
}

export interface ExchangeRateData {
  rate: number;
  rateString: string;
  source: string;
  updatedAt: string;
}
