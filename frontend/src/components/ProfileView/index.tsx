"use client";
import ConnectedAccount from "@/components/ProfileView/ConnectedAccount";
import ConnectedPlatsApp from "@/components/ProfileView/ConnectedPlatsApp";
import YourUnifiedIdProfile from "@/components/ProfileView/YourUnifiedIdProfile";
import React, { useEffect, useState } from "react";
import Banner from "@/components/ProfileView/Banner";
import accountApiRequest from "@/apiRequest/account";
import useSWR from "swr";
import { clientAccessToken } from "@/lib/http";

export default function ProfileView() {
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const { data, error } = useSWR("/user", accountApiRequest.user, {
    refreshInterval: 10000, // 10 giây
  });

  console.log("🚀 ~ ProfileView ~ data:", data);



  return (
    <div className="min-h-[100vh] w-full flex flex-col items-center  gap-10 text-white  ">
      {/* Banner */}
      <Banner
        isFirstLoad={isFirstLoad}
        platId={data ? data?.payload?.data?.user?.plat_id : ""}
      />

      {/* Profile */}
      <div className="w-full h-full bg-[url('/BackgroundProfile.png')] bg-no-repeat bg-cover bg-center">
        <div className="max-w-screen-xl w-full mx-auto pt-[100px] pb-10 flex lg:flex-row flex-col gap-[43px] px-5 ">
          <ConnectedAccount
            user={data?.payload?.data?.user}
            isFirstLoad={isFirstLoad}
          />

          <div className="flex flex-col gap-8 lg:max-w-[706px] w-full">
            <YourUnifiedIdProfile
              data={data?.payload?.data?.user}
              isFirstLoad={isFirstLoad}
            />

            <ConnectedPlatsApp />
          </div>
        </div>
      </div>
    </div>
  );
}
