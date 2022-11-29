import { Binance } from "./cexs/binance";
import { fetchOpenbookOrders } from "./openbook/getOrderBook";
import { CandleChartInterval } from "binance-api-node";
import { wait } from "./utils/timer";
import { getPercentageIncrease } from "./utils/getPercentage";
import { placeLimitOrder } from "./openbook/placeLimitOrder";
import { settleFounds } from "./openbook/settleFounds";
import * as dotenv from "dotenv";
dotenv.config();

class Bot {
  private dexSellPrice: number = 0;
  private dexBuyPrice: number = 0;
  private cexPrice = 0;
  private binance: Binance;
  private inPosition = false;

  constructor() {
    this.binance = new Binance();
  }

  async start() {
    this.updateDexPrices();
    this.updateCexPrice();

    do {
      console.log("CEX price: ", this.cexPrice);

      console.log("DEX buy price: ", this.dexBuyPrice);
      console.log("DEX sell price: ", this.dexSellPrice);

      const buyDiff = getPercentageIncrease(this.cexPrice, this.dexBuyPrice);
      const sellDiff = getPercentageIncrease(this.cexPrice, this.dexSellPrice);

      console.log("buyDiff", buyDiff);
      console.log("sellDiff", sellDiff);

      if (sellDiff < -0.5 && this.cexPrice > 0 && !this.inPosition) {
        console.log("Buy on binance. At price: ", this.cexPrice);
        console.log("Sell on orderbook At price: ", this.dexSellPrice);
        this.inPosition = true;

        const promiseDex = placeLimitOrder(this.dexSellPrice, "sell", 1);
        const promiseCex = this.binance.placeLimitOrder({
          price: (this.cexPrice + 0.1).toString().slice(0, 5),
          side: "BUY",
          quantity: "1",
          symbol: "SOLUSDT",
        });

        const [dexOrder, cexOrder] = await Promise.all([
          promiseDex,
          promiseCex,
        ]);

        console.log("dexOrder", dexOrder);
        console.log("cexOrder", cexOrder);

        this.binance.placeLimitOrder({
          price: (this.cexPrice + 0.1).toString().slice(0, 5),
          side: "SELL",
          quantity: "1",
          symbol: "SOLUSDT",
        });
      }

      if (buyDiff > 0.5 && this.cexPrice > 0 && !this.inPosition) {
        console.log("Sell on binance. At price: ", this.cexPrice);
        console.log("Buy on orderbook At price: ", this.dexBuyPrice);
        this.inPosition = true;

        const promiseDex = placeLimitOrder(this.dexBuyPrice, "buy", 1);
        const promiseCex = this.binance.placeLimitOrder({
          price: this.cexPrice.toString().slice(0, 5),
          side: "SELL",
          quantity: "1",
          symbol: "SOLUSDT",
        });

        const [dexOrder, cexOrder] = await Promise.all([
          promiseDex,
          promiseCex,
        ]);

        console.log("dexOrder", dexOrder);
        console.log("cexOrder", cexOrder);
      }

      // settleFounds();
      await wait(500);
    } while (true);
  }

  private updateDexPrices() {
    fetchOpenbookOrders(({ toBuyOrdersArray, toSellOrdersArray }) => {
      this.dexBuyPrice = toBuyOrdersArray[0].price;
      this.dexSellPrice = toSellOrdersArray[0].price;
    });
  }

  private updateCexPrice() {
    this.binance.getKline("SOLUSDT", CandleChartInterval.ONE_MINUTE, (data) => {
      this.cexPrice = +data.close;
    });
  }
}

const bot = new Bot();

bot.start();

// settleFounds();

// const main = async () => {
//   try {
//     const binance = new Binance();
//     const x = await binance.placeLimitOrder({
//       price: "13",
//       side: "SELL",
//       quantity: "0.99",
//       symbol: "SOLUSDT",
//     });
//     console.log(x);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const main = async () => {
//   try {
//     const res = await placeLimitOrder(13.24, "buy", 1);

//     console.log(res);
//   } catch (err) {
//     console.log(err);
//   }
// };

// main();
