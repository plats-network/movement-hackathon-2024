"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import Link from "next/link";
import Image from "next/image";
import WalletIcon from "@/assets/WalletIcom";

export default function Home() {
  const { publicKey } = useWallet();
  return (
    <div className="relative h-[100vh] flex items-center justify-center ">

      <div className="absolute bottom-0 left-0">
        <div className="relative w-[488px] h-[360px]">
          <Image alt="left" src={'/LeftImage.png'} sizes="100%" fill objectFit="contain"/>
        </div>
      </div>

      <div className="absolute top-10 right-0">
        <div className="relative w-[283px] h-[243px]">
          <Image alt="left" src={'/RightImage.png'} sizes="100%" fill objectFit="contain"/>
        </div>
      </div>
      <div className="max-w-screen-sm w-full flex flex-col items-center justify-center gap-16">
        <div className="relative w-[131px] h-[144px]">
          <Image
            alt="logo"
            src={"/Logo.png"}
            sizes="100%"
            fill
            objectFit="contain"
          />
        </div>
{/* 
        <div className="flex flex-col gap-8 text-center z-50">
            <p className="text-[32px] text-white">
              Your gateway <br />
              to personalized web3 experience
            </p>
            <Link
              href={"/login"}
              className="w-full py-4 text-base font-bold  flex items-center justify-center gap-2 text-white rounded-xl  cursor-pointer bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]  "
            >
              <WalletIcon />
              <p> Connect your account</p>
            </Link>
          </div> */}
        {publicKey ? (
          <div className="flex flex-col gap-3 text-center z-50 text-white">
            <p className="text-2xl font-bold">{`You are relized as: <result>`}</p>
            <p className="text-2xl font-bold">{`Your score is: <score>`}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 text-center z-50">
            <p className="text-[32px] text-white">
              Your gateway <br />
              to personalized web3 experience
            </p>
            <Link
              href={"/login"}
              className="w-full py-4 text-base font-bold  flex items-center justify-center gap-2 text-white rounded-xl  cursor-pointer bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]  "
            >
              <WalletIcon />
              <p> Connect your account</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
