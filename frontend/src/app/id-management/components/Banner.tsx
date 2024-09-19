'use client'
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image'
import React from 'react'

const Banner = ({platId}: {platId: string}) => {
  const { publicKey } = useWallet();

  return (
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
           {platId ?? "- -"}
          </p>
        
        </div>
      </div>
  )
}

export default Banner