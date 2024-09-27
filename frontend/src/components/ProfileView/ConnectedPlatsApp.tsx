"use client";

import DeleteIcon from "@/assets/DeleteIcon";
import PlatsAppLogo from "@/assets/PlatsAppLogo";
import useSWR from "swr";
import platsApiRequest from "@/apiRequest/plats";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getIdentityPDA, program } from "@/anchor/setup";
import { Switch } from "@/components/ui/switch";
import useProviderConnect from "@/hooks/useProviderConnect";
import { toast } from "@/hooks/use-toast";
import ActivePlatAppButton from "@/components/shared/ActivePlatAppButton";

const ConnectedPlatsApp = ({ platId }: { platId: string }) => {
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [activePlatApps, setActivePlatApps] = useState<string[]>([]);

  const { getProvider } = useProviderConnect();

  const provider = getProvider();

  const { data, error } = useSWR("/app", platsApiRequest.app, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  console.log("🚀 ~ ConnectedPlatsApp ~ data:", data?.payload?.data?.plat_apps);

  const handleActivePlatApp = async (appId: any) => {
    console.log("platId", platId);
    console.log("appId", appId);
    console.log("publicKey", publicKey?.toBase58());
    if (!platId ) {
      toast({
        className: "z-50 text-white",
        description: "platId not found",
      });
      return
    }
   

    try {
      const transaction = await program.methods
        .addPermissions(platId, [appId])
        .accounts({
          // @ts-ignore
          signer: publicKey,
          identity: getIdentityPDA(platId),
        })
        .transaction();

      const transactionSignature = await sendTransaction(
        transaction,
        provider.connection
      );
      console.log("🚀 ~ onClick ~ transactionSignature:", transactionSignature);

      toast({
        className: "z-50 text-white",
        description: "Active plat app successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        className: "z-50 text-white",
        description: "Active failed",
      });
    }
  };

  const handleUnActivePlatApp = async (appId: any) => {
    console.log("platId", platId);
    console.log("appId", appId);
    if (!platId ) {
      toast({
        className: "z-50 text-white",
        description: "platId not found",
      });
      return
    }

    try {
      const transaction = await program.methods
        .revokePermissions(platId, [appId])
        .accounts({
          // @ts-ignore
          signer: publicKey,
          identity: getIdentityPDA(platId),
        })
        .transaction();

      const transactionSignature = await sendTransaction(
        transaction,
        provider.connection
      );
      console.log("🚀 ~ onClick ~ transactionSignature:", transactionSignature);

      toast({
        className: "z-50 text-white",
        description: "UnActive plat app successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        className: "z-50 text-white",
        description: "UnActive failed",
      });
    }
  };

  return (
    <div className="relative w-full">
      <div
        className="absolute inset-0 rounded-xl  opacity-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(25,5,50,1),rgba(102,255,255,1) 0%)",
        }}
      ></div>
      <div className="relative flex flex-col gap-8 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xl text-[#3AE7E7] font-semibold">
            Connected Plats App
          </p>
          <button className="text-base text-[#3AE7E7] underline">
            See all
          </button>
        </div>
        {/* <div className='flex flex-col items-center justify-center text-center gap-3 my-[27px]'>
      <p className='text-[40px] font-bold'>- -</p>
      <p className='text-[17px] text-[#B172FF]'>You haven't connected to any accounts yet</p>
    </div> */}
        <div className="flex sm:flex-row flex-col gap-2">
          {data ? (
            data?.payload?.data?.plat_apps.map((plat: any, index: number) => (
              <div
                key={index}
                className="group sm:max-w-[251px] w-full flex flex-col px-3 justify-center text-center   bg-[#1A1A36] hover:bg-[#060625] cursor-pointer rounded-[12px]"
              >
                <a href={plat.app_url} target="_blank" className=" py-[22px]">
                  <div className="flex items-center  gap-3">
                    <PlatsAppLogo />
                    <p className="text-[17px] text-[#B7B4BB] group-hover:bg-gradient-to-r from-[#3AE7E7] to-[#8737E9] group-hover:text-transparent group-hover:bg-clip-text">
                      {plat.app_name || `Plats App 0${index + 1}`}
                    </p>
                  </div>
                </a>
                <div className=" flex gap-3 w-full justify-end items-center pb-3">
                  <ActivePlatAppButton
                    appId={plat.app_id}
                    handleActivePlatApp={handleActivePlatApp}
                    handleUnActivePlatApp={handleUnActivePlatApp}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-center gap-3 my-[27px]">
              <p className="text-[40px] font-bold">- -</p>
              <p className="text-[17px] text-[#B172FF]">
                You haven't connected to any accounts yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectedPlatsApp;
