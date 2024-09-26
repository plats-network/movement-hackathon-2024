'use client'
import EthereumIcon from "@/assets/EthereumIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { sumBalances } from "@/lib/helper";
import React from "react";

const YourUnifiedIdProfile = ({ data, isFirstLoad }: { data: any, isFirstLoad: boolean }) => {


  return (
    <div className="relative w-full ">
      <div
        className="absolute inset-0 rounded-xl opacity-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(25,5,50,1),rgba(102,255,255,1) 0%)",
        }}
      ></div>
      <div className="relative   flex flex-col gap-8 p-5 ">
        <div className="flex w-full items-center justify-between">
          <p className="text-xl text-[#3AE7E7] font-semibold">
            Your Unified ID Profile
          </p>

          <EthereumIcon />
        </div>
        <div className="flex sm:flex-row flex-col gap-2  max-w-[667px] w-full">
          <div className="group gradient-border-mask  md:w-[200px]  w-full  flex items-center justify-center flex-col gap-2 text-center py-3  bg-[#1A1A36] hover:bg-[#060625] cursor-pointer rounded-[12px]">
                 {
            !data ? (<Skeleton className="h-[35px] w-[160px] bg-slate-400"/>) : (
              <p className="text-[40px] font-bold group-hover:text-[#3AE7E7]">
             {data?.balances
                ? '$' + sumBalances(data?.balances).toFixed(1)
                : "- -"}
            </p>
            )
           }
            <p className="text-[17px] text-[#B7B4BB] group-hover:text-white">
              Your balance
            </p>
          </div>
          <div className="group gradient-border-mask md:w-[200px]  w-full flex items-center justify-center flex-col gap-2 text-center py-3  bg-[#1A1A36] hover:bg-[#060625] cursor-pointer rounded-[12px]">
                {
            !data ? (<Skeleton className="h-[35px] w-[160px] bg-slate-400"/>) : (
              <p className="text-[40px] font-bold group-hover:text-[#3AE7E7]">
             {data?.volumes
                ? '$' + sumBalances(data?.volumes).toFixed(1)
                : "- -"}
            </p>
            )
           }
            <p className="text-[17px] text-[#B7B4BB] group-hover:text-white">
              One month volume
            </p>
          </div>
          <div className="group gradient-border-mask  md:w-[200px] w-full  flex items-center justify-center flex-col gap-2 text-center py-3  bg-[#1A1A36] hover:bg-[#060625] cursor-pointer rounded-[12px]">
           {
            !data ? (<Skeleton className="h-[35px] w-[160px] bg-slate-400"/>) : (
              <p className="text-[40px] font-bold group-hover:text-[#3AE7E7]">
             {Number(data?.twitter_score) >= 0
                ? Number(data?.twitter_score).toFixed(1)
                : "- -"}
            </p>
            )
           }
            <p className="text-[17px] text-[#B7B4BB] group-hover:text-white">
              Twitter Scores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourUnifiedIdProfile;
