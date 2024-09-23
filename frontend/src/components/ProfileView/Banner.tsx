'use client'
import { Skeleton } from '@/components/ui/skeleton';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image'
import React from 'react'

const Banner = ({isFirstLoad, platId}: {isFirstLoad:boolean , platId: string}) => {


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

          {!platId ? (
<Skeleton className="h-[35px] w-[210px] bg-slate-500 mt-20" />

    ) : (
      <p className="text-[28px] font-semibold mt-20">
      {platId ?? "- -"}
     </p>
    )
         
  }
        </div>
      </div>
  )
}

export default Banner