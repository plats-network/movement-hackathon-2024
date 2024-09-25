"use client";
import accountApiRequest from "@/apiRequest/account";
import AddIcon from "@/assets/AddIcon";
import CloseIcon from "@/assets/CloseIcon";
import GoogleIcon from "@/assets/GoogleIcon";
import TelegramIcon from "@/assets/TelegramIcon";
import TwitterIcon from "@/assets/TwitterIcon";
import WalletIcon from "@/assets/WalletIcom";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "@/hooks/use-toast";
import useClickOutside from "@/hooks/useClickOutside";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { PublicKey } from "@solana/web3.js";

const ConnectAccountModal = ({
  platId,
  listAddress,
}: {
  platId: string;
  listAddress: any[];
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const { publicKey } = useWallet();
  const { publicKey, disconnect, connect } = useWallet();
  const [currentPublicKey, setCurrentPublicKey] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState<boolean>(false);

  const modalRef = useRef(null);
  const route = useRouter();
  useClickOutside(modalRef, () => setIsOpen(!isOpen));

  const handleAddTwitterAccount = async () => {
    try {
      setIsLoading(true);
      if (!platId) return;
      window.open(
        `${process.env.NEXT_PUBLIC_API}/twitter/login?plat_id=${platId}`,
        "_self"
      );
    } catch (error) {
      setIsLoading(false);
      console.log("🚀 ~ handleAddTwitterAccount ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewWallet = async () => {
    try {
      setIsLoadingWallet(true);
      console.log("publicKey", publicKey?.toBase58());
      console.log("listAddress", listAddress);

      if (!publicKey) return;
      if (
        listAddress.some((address) => currentPublicKey?.toBase58() === address)
        // currentPublicKey === address
      ) {
        toast({
          className: "z-50 text-white",

          description: "You need change another account to add unique ID",
        });
        return;
      }
      const data = {
        public_key: Buffer.from(currentPublicKey.toBytes()).toString("base64"),
        address: currentPublicKey?.toBase58(),
      };
      console.log("🚀 ~ handleAddNewWal ~ data:", data);

      const response = await accountApiRequest.addNewWallet(data);
      console.log("🚀 ~ handleAddNewWal ~ response:", response);
      toast({
        className: "z-50 text-white",

        description: response.payload.msg,
      });
      setIsOpen(false);
    } catch (error) {
      console.log("🚀 ~ handleAddNewWal ~ error:", error);
      setIsLoadingWallet(false);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      setCurrentPublicKey(publicKey); // Convert publicKey to string (base58)
    } else {
      setCurrentPublicKey(null); // Xử lý khi không có publicKey (chưa connect)
    }
  }, [publicKey]); // Chạy lại khi giá trị publicKey thay đổi

  useEffect(() => {
    const provider = window.solana;

    if (provider && provider.isPhantom) {
      provider.on("accountChanged", (newPublickey: PublicKey) => {
        console.log("New wallet public key:", newPublickey?.toBase58());
        // Handle the new wallet address
        setCurrentPublicKey(newPublickey);
      });
    }

    return () => {
      if (provider && provider.isPhantom) {
        provider.disconnect();
      }
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]  rounded-xl w-full py-4 text-base font-bold text-center text-white cursor-pointer flex items-center justify-center gap-2"
      >
        <AddIcon />
        <p> Add New Account</p>
      </button>

      {/* Main modal */}

      {isOpen && (
        <div className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-transparent backdrop-blur-lg ">
          <div className="relative w-full max-w-xl max-h-full gradient-border-mask-box p-5 bg-[#08082C] rounded-2xl mx-2">
            <div
              ref={modalRef}
              className="relative  shadow-lg flex flex-col gap-8 "
            >
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold">Connect your account</p>
                <button onClick={() => setIsOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="w-full h-full justify-center flex flex-col gap-4 text-center">
                <LoadingButton
                  loading={isLoadingWallet}
                  onClick={handleAddNewWallet}
                  className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4 h-[56px]  text-white text-base cursor-pointer rounded-xl"
                >
                  <WalletIcon />
                  <p> Connect your Wallet</p>
                </LoadingButton>

                {/* <button className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white text-base cursor-pointer rounded-xl">
                  <GoogleIcon />
                  <p> Continue with Google</p>
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white  text-base cursor-pointer rounded-xl">
                  <TelegramIcon />
                  <p> Continue with telegram</p>
                </button> */}
                <LoadingButton
                  loading={isLoading}
                  onClick={handleAddTwitterAccount}
                  className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4 h-[56px] text-white text-base cursor-pointer rounded-xl"
                >
                  <TwitterIcon />
                  <p> Continue with twitter</p>
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectAccountModal;
