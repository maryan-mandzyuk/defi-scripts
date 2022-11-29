import { Market } from "@project-serum/serum";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getMarket } from "../get-market";
import { getOwner } from "../getOwner";

export const placeLimitOrder = async (
  price: number,
  side: "buy" | "sell",
  size: number
) => {
  try {
    const { market, connection } = await getMarket(
      "8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6",
      "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"
    );
    const owner = getOwner();

    const payer = new PublicKey("WgPS1gB5MYZJ4Hu1J9t7EtvMbi2KhrSC4YytbQWJjwW"); // spl-token account
    const order = await market.placeOrder(connection, {
      //@ts-ignore
      owner,
      payer,
      side, // 'buy' or 'sell'
      price,
      size,
      orderType: "limit", // 'limit', 'ioc', 'postOnly'
    });

    console.log("Open book order: ", order);

    return order;
  } catch (err) {
    console.log(err);
  }
};
