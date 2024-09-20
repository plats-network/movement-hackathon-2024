"use client";

import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { sliceAddressWallet } from "@/lib/helper";
import * as React from "react";
import { Button } from "@/components/ui/button";
import WalletIcon from "@/assets/WalletIcom";

export default function WalletButton({
  isLoading,
  handleGetNonce,
}: {
  isLoading: boolean;
  handleGetNonce: () => void;
}) {
  const { setVisible: setModalVisible } = useWalletModal();
  const { publicKey, onDisconnect } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true);
    },
  });
  const handleLogin = () => {
    try {
      if (!publicKey) {
        setModalVisible(true);
      } else {
        handleGetNonce();
      }
    } catch (error) {}
  };

  return (
    <>
      

<Button
disabled={isLoading}
          onClick={handleLogin}
          className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]  rounded-xl w-full h-[56px] text-base font-bold flex items-center justify-center gap-2 text-white cursor-pointer"
        >
          <WalletIcon />
          {publicKey ? "Connect your wallet" + " " + sliceAddressWallet(publicKey) : <p>Connect your wallet</p>}
          
        </Button>
    </>
  );""
}
