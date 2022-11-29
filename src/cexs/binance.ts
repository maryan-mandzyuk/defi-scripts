import { Binance as BinanceType, Candle, OrderType } from "binance-api-node";

import * as BIN from "binance-api-node";

import { CEX } from "../cex";

export interface BinancePlaceLimitOrder {
  price: string;
  symbol: string;
  quantity: string;
  side: "BUY" | "SELL";
}

export class Binance implements CEX {
  private readonly binance: BinanceType;

  constructor() {
    this.binance = BIN.default({
      apiKey: process.env.BINANCE_API_KEY,
      apiSecret: process.env.BINANCE_API_SECRET,
    });
  }

  getKline(symbol: string, interval: string, cb: (data: Candle) => void): void {
    this.binance.ws.futuresCandles(symbol, interval, (data) => {
      if (data) {
        cb(data);
      }
    });
  }

  async placeLimitOrder({
    price,
    side,
    symbol,
    quantity,
  }: BinancePlaceLimitOrder) {
    try {
      const order = await this.binance.order({
        type: OrderType.LIMIT,
        price,
        symbol,
        quantity,
        side,
      });

      return order;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }
}
