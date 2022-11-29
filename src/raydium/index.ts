import { Market, TradeV2 } from "@raydium-io/raydium-sdk";
import { Connection, PublicKey } from "@solana/web3.js";

export const getTrades = async () => {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  const marketAddress = new PublicKey(
    "syNSyUTeJf8rohN5LRZkcka4Jh78eQHwoDDrZxaYdzd"
  );
  const programAddress = new PublicKey(
    "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
  );

  const market = Market.getAssociatedAuthority({
    marketId: marketAddress,
    programId: programAddress,
  });
};
