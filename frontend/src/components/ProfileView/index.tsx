
import ConnectedAccount from "@/components/ProfileView/ConnectedAccount";
import ConnectedPlatsApp from "@/components/ProfileView/ConnectedPlatsApp";
import YourUnifiedIdProfile from "@/components/ProfileView/YourUnifiedIdProfile";
import React from "react";
import Banner from "@/components/ProfileView/Banner";
import { cookies } from "next/headers";
import accountApiRequest from "@/apiRequest/account";

export default async function ProfileView ()  {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  const response = await accountApiRequest.user(accessToken?.value ?? "");
  console.log("🚀 ~ ProfileView ~ response:", response?.data.data.user)

  return (
    <div className="min-h-[100vh] w-full flex flex-col items-center  gap-10 text-white  ">
      {/* Banner */}
      <Banner platId={response?.data?.data?.user?.plat_id}/>
      

      {/* Profile */}
      <div className="w-full h-full bg-[url('/BackgroundProfile.png')] bg-no-repeat bg-cover bg-center">
      <div className="max-w-screen-xl w-full mx-auto pt-[100px] pb-10 flex lg:flex-row flex-col gap-[43px] px-5 ">
        <ConnectedAccount user={response?.data?.data?.user} />

        <div className="flex flex-col gap-8 lg:max-w-[706px] w-full">
          <YourUnifiedIdProfile data={response?.data.data.user}/>

          <ConnectedPlatsApp />
        </div>
      </div>
      </div>

      
    </div>
  );
};


