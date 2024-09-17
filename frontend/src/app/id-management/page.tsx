"use client";

import authApiRequest from "@/apiRequest/auth";
import ConnectedAccount from "@/app/id-management/components/ConnectedAccount";
import ConnectedPlatsApp from "@/app/id-management/components/ConnectedPlatsApp";
import YourUnifiedIdProfile from "@/app/id-management/components/YourUnifiedIdProfile";
import DeleteIcon from "@/assets/DeleteIcon";
import GoogleIcon from "@/assets/GoogleIcon";
import PlatsAppLogo from "@/assets/PlatsAppLogo";
import TelegramIcon from "@/assets/TelegramIcon";
import TwitterIcon from "@/assets/TwitterIcon";
import WalletIcon from "@/assets/WalletIcom";
import ConnectAccountModal from "@/components/ConnectAccountModal";
import { Switch } from "@/components/ui/switch";

import { useWallet } from "@solana/wallet-adapter-react";
import { CreditCard, Trash2 } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const IdManagement = () => {
  const { publicKey } = useWallet();


  return (
    <div className="h-[100vh] w-full flex flex-col items-center  gap-10 text-white  ">
      {/* Banner */}
      <div className="relative w-full h-[262px]  bg-[url('/BannerImage.png')] bg-no-repeat bg-cover bg-center">
        <div className="absolute -bottom-1/3 left-1/2 transform -translate-x-1/2  h-[200px] max-w-screen-xl w-full flex  items-center gap-3">
          <div className="relative h-[200px] w-[200px] ">
            <Image
              alt="avatar"
              src={"/ProfileImage.png"}
              sizes="100%"
              fill
              objectFit="contain"
            />
          </div>
          <p className="text-[28px] font-semibold mt-20">
            {publicKey?.toString()}
          </p>
        
        </div>
      </div>

      {/* Profile */}
      <div className="w-full h-full bg-[url('/BackgroundProfile.png')] bg-no-repeat bg-cover bg-center">
      <div className="max-w-screen-xl w-full mx-auto pt-[100px] flex gap-[43px] ">
        <ConnectedAccount />

        <div className="flex flex-col gap-8">
          <YourUnifiedIdProfile />

          <ConnectedPlatsApp />
        </div>
      </div>
      </div>

      
    </div>
  );
};

export default IdManagement;
