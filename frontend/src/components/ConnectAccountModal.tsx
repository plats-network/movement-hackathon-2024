"use client";
import accountApiRequest from "@/apiRequest/account";
import AddIcon from "@/assets/AddIcon";
import CloseIcon from "@/assets/CloseIcon";
import GoogleIcon from "@/assets/GoogleIcon";
import TelegramIcon from "@/assets/TelegramIcon";
import TwitterIcon from "@/assets/TwitterIcon";
import WalletIcon from "@/assets/WalletIcom";
import { LoadingButton } from "@/components/ui/loading-button";
import useClickOutside from "@/hooks/useClickOutside";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import React, {useRef, useState } from "react";

const ConnectAccountModal = ({ platId }: { platId: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modalRef = useRef(null);
  const route = useRouter();
  useClickOutside(modalRef, () => setIsOpen(!isOpen));

  

  const handleAddTwitterAccount = async () => {
    try {
      setIsLoading(true)
      if (!platId) return;
      const response = await accountApiRequest.addTwitter(platId);
      console.log("🚀 ~ handleAddTwitterAccount ~ response:", response)
        route.push(response.payload?.data?.auth_url)
     
    } catch (error) {
      setIsLoading(false)
    console.log("🚀 ~ handleAddTwitterAccount ~ error:", error)
    } finally {
      setIsLoading(false)
    }
  };

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
                {/* <button className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white text-base cursor-pointer rounded-xl">
                  <WalletIcon />
                  <p> Connect your Wallet</p>
                </button> */}

                {/* <button className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white text-base cursor-pointer rounded-xl">
                  <GoogleIcon />
                  <p> Continue with Google</p>
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white  text-base cursor-pointer rounded-xl">
                  <TelegramIcon />
                  <p> Continue with telegram</p>
                </button> */}
                <LoadingButton loading={isLoading} onClick={handleAddTwitterAccount} className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white text-base cursor-pointer rounded-xl">
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
