import { Candle } from "binance-api-node";

export interface CEX {
  getKline: (
    symbol: string,
    interval: string,
    cb: (data: Candle) => void
  ) => void;
}
