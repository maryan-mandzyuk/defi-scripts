import { Keypair, PublicKey } from "@solana/web3.js";
import { getMarket } from "../get-market";
import { getOwner } from "../getOwner";

export const settleFounds = async () => {
  const { market, connection } = await getMarket(
    "8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6",
    "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"
  );

  const owner = getOwner();

  for (let openOrders of await market.findOpenOrdersAccountsForOwner(
    connection,
    owner.publicKey
  )) {
    if (
      openOrders.baseTokenFree.toNumber() > 0 ||
      openOrders.quoteTokenFree.toNumber() > 0
    ) {
      // spl-token accounts to which to send the proceeds from trades
      const baseTokenAccount = new PublicKey(
        "WgPS1gB5MYZJ4Hu1J9t7EtvMbi2KhrSC4YytbQWJjwW" // trade wallet address
      );
      const quoteTokenAccount = new PublicKey(
        "CDzvdrQKiMHm3bEtGtx5NToJRh9m4nuRB4N2Qykgmo8h" // spl-token address USDC
      );

      const settles = await market.settleFunds(
        connection,
        //@ts-ignore
        owner,
        openOrders,
        baseTokenAccount,
        quoteTokenAccount
      );
      console.log(settles);
    }
  }
};
