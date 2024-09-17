import { endpoint } from '@/lib/helper';
import * as anchor from "@project-serum/anchor";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

export default function useProviderConnect () {
  const wallet = useAnchorWallet();

  const getProvider = () => {
    const connection = new Connection(endpoint, "processed");
    const provider = new anchor.AnchorProvider(connection, wallet as any, {
      preflightCommitment: "processed",
    });
    return provider;
  };

  return {getProvider}
}
