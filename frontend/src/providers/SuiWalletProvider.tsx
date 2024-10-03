"use client";


import { PontemWalletAdapter, WalletProvider } from "@manahippo/aptos-wallet-adapter";
import { ReactNode, useMemo } from "react";



export default function SuiWalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const wallets = [
    new PontemWalletAdapter(),
  ];



  return (
    <WalletProvider
    wallets={wallets}
    autoConnect
    >
{children}
    </WalletProvider>
  
  );
}
