import { Market } from "@project-serum/serum";
import { Connection, PublicKey } from "@solana/web3.js";

export const getMarket = async (marketKey: string, programKey: string) => {
  try {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const marketAddress = new PublicKey(marketKey);
    const programAddress = new PublicKey(programKey);

    const market = await Market.load(
      connection,
      marketAddress,
      {},
      programAddress
    );

    return { market, connection };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
