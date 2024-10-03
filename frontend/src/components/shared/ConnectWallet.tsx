"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import WalletIcon from "@/assets/WalletIcom";

import { useWallet, Wallet } from "@manahippo/aptos-wallet-adapter";

import { ellipsize } from "@/lib/utils";

const ConnectWallet = () => {
  const { connected, account, disconnect, wallets, select } = useWallet();

  const [copied, setCopied] = React.useState(false);

  // useEffect(() => {
  //     if (account?.address) {
  //         setValue(account?.address?.toString())
  //     }
  // }, [account, setValue])

  const onConnect = async (wallet: Wallet) => {
    await select(wallet.adapter.name);
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]  rounded-xl w-full py-4 text-base font-bold text-center text-white cursor-pointer">
            {connected
              ? ellipsize(account?.address?.toString(), 8)
              : "Connect Wallet"}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 ">
          {!connected &&
            wallets.map((wallet) => (
              <DropdownMenuItem
                key={wallet.adapter.name}
                onClick={() => onConnect(wallet)}
                className="cursor-pointer"
              >
                {wallet.adapter.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
   
  );
};

export default ConnectWallet;
