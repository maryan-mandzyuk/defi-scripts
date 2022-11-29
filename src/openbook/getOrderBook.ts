import { Market } from "@project-serum/serum";
import { Connection, PublicKey } from "@solana/web3.js";
import { getMarket } from "../get-market";
import BN from "bn.js";
import { Order } from "@project-serum/serum/lib/market";
import { wait } from "../utils/timer";

export const fetchOpenbookOrders = async (
  cb: (data: { toBuyOrdersArray: Order[]; toSellOrdersArray: Order[] }) => void
) => {
  try {
    const { market: marketOpenbook, connection: connectionOpenbook } =
      await getMarket(
        "8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6",
        "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"
      );

    do {
      const bidsOpenbook = await marketOpenbook.loadBids(connectionOpenbook);
      const asksOpenbook = await marketOpenbook.loadAsks(connectionOpenbook);
      const toBuyOrdersArray = Array.from(asksOpenbook.items(false)).slice(
        0,
        2
      );

      const toSellOrdersArray = Array.from(bidsOpenbook.items(true)).slice(
        0,
        2
      );

      cb({ toBuyOrdersArray, toSellOrdersArray });

      const delayInMilliseconds = 700; //1 second

      await wait(delayInMilliseconds);
    } while (true);
  } catch (err) {
    console.log(err);
  }
};

export interface Fill {
  eventFlags: { fill: boolean; out: boolean; bid: boolean; maker: boolean };
  openOrdersSlot: number;
  feeTier: number;
  nativeQuantityReleased: BN;
  nativeQuantityPaid: BN;
  nativeFeeOrRebate: BN;
  orderId: BN;
  openOrders: PublicKey;
  clientOrderId: BN;
  side: "sell" | "buy";
  price: number;
  feeCost: number;
  size: number;
}
