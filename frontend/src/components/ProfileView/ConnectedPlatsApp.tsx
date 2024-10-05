"use client";

import DeleteIcon from "@/assets/DeleteIcon";
import PlatsAppLogo from "@/assets/PlatsAppLogo";
import useSWR from "swr";
import platsApiRequest from "@/apiRequest/plats";
import { useState } from "react";

import { Switch } from "@/components/ui/switch";

import { toast } from "@/hooks/use-toast";
import ActivePlatAppButton from "@/components/shared/ActivePlatAppButton";
import useSubmitTransaction from "@/hooks/useSubmitTransaction";
import { CONTRACT_ADDRESS } from "@/lib/env.config";

const ADD_PERMISSIONS_FUNCTION = `${CONTRACT_ADDRESS}::plats_id::add_permissions`;
const REVOKE_PERMISSIONS_FUNCTION = `${CONTRACT_ADDRESS}::plats_id::revoke_permissions`;

const ConnectedPlatsApp = ({ platId }: { platId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activePlatApps, setActivePlatApps] = useState<string[]>([]);

  const { data, error } = useSWR("/app", platsApiRequest.app, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  console.log("🚀 ~ ConnectedPlatsApp ~ data:", data?.payload?.data?.plat_apps);

  const { submitTransaction } = useSubmitTransaction();

  const handleActivePlatApp = async (appId: any) => {
    try {
      const payload = {
        type: "entry_function_payload",
        function: ADD_PERMISSIONS_FUNCTION,
        arguments: [
          "nhatnguyen1.ID",
          ["be94da783e0ee11bbdb9de2f9c6745f15b1f9bfc3007dab7f77ec2eed2400b05"],
        ],
        type_arguments: [],
      };

      const success = await submitTransaction(payload, {
        title: "Add Permissions Succeeded",
        description: `You have successfully added`,
      });

      console.log("🚀 ~ setMessage ~ success:", success);
    } catch (error) {}
  };

  const handleUnActivePlatApp = async (appId: any) => {
    try {
      const payload = {
        type: "entry_function_payload",
        function: REVOKE_PERMISSIONS_FUNCTION,
        arguments: [
          "nhatnguyen1.ID",
          ["be94da783e0ee11bbdb9de2f9c6745f15b1f9bfc3007dab7f77ec2eed2400b05"],
        ],
        type_arguments: [],
      };

      const success = await submitTransaction(payload, {
        title: "Add Permissions Succeeded",
        description: `You have successfully added`,
      });

      console.log("🚀 ~ setMessage ~ success:", success);
    } catch (error) {}
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
