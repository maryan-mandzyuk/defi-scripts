import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export const getOwner = () => {
  const owner = Keypair.fromSecretKey(bs58.decode(process.env.SOL_SECRET_KEY!));

  return owner;
};
