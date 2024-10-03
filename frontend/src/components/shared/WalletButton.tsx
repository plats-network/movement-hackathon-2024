"use client";

import { sliceAddressWallet } from "@/lib/helper";
import * as React from "react";
// import { Button } from "@/components/ui/button";
import WalletIcon from "@/assets/WalletIcom";
import { LoadingButton } from "@/components/ui/loading-button";
import { useWallet, Wallet } from "@manahippo/aptos-wallet-adapter";
import { ellipsize } from "@/lib/utils";


export default function WalletButton({
  isLoading,
  isConnect,
  handleGetNonce,
}: {
  isLoading: boolean;
  isConnect: boolean;
  handleGetNonce: () => void;
}) {

    const { connected, account, disconnect, wallets, select } = useWallet();

    const onConnect = async (wallet : Wallet) => {
        await select(wallet.adapter.name);
    }



  const handleLogin = () => {
    try {
      if (!account?.address) {
       onConnect(wallets[0])
      } else {
        handleGetNonce();
      }
    } catch (error) {}
  };

  return (
    <>
      <LoadingButton
        loading={isLoading }
        disabled={isLoading || !isConnect}
        onClick={handleLogin}
        className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]  rounded-xl w-full h-[56px] text-base font-bold flex items-center justify-center gap-2 text-white cursor-pointer"
      >
        {!isLoading && <WalletIcon />}
        {(connected ? "Verify your wallet" + " " + ellipsize(account?.address?.toString(), 8) : 'Connect your wallet')}
      
      </LoadingButton>
    </>
  );
  ("");
}
