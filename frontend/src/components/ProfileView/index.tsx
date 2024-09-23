
'use client'
import ConnectedAccount from "@/components/ProfileView/ConnectedAccount";
import ConnectedPlatsApp from "@/components/ProfileView/ConnectedPlatsApp";
import YourUnifiedIdProfile from "@/components/ProfileView/YourUnifiedIdProfile";
import React, { useEffect, useState } from "react";
import Banner from "@/components/ProfileView/Banner";
import accountApiRequest from "@/apiRequest/account";


export default  function ProfileView ()  {

  const [userData, setUserData] = useState<any>(null);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  let timeoutId:any;

  const handleGetProfile = async () => {
    try {
      const response = await accountApiRequest.user();
      console.log("🚀 ~ ProfileView ~ response:", response?.data?.data?.user);

      if (response) {
        setUserData(response?.data?.data?.user);
        setIsFirstLoad(false);
      }

      // Sau khi nhận được response, thiết lập lại thời gian chờ 10 giây để gọi lại API
      timeoutId = setTimeout(() => {
        handleGetProfile();
      }, 10000); // 10 giây

    } catch (error) {
      console.log("🚀 ~ handleGetProfile ~ error:", error);

      // Nếu xảy ra lỗi, vẫn thiết lập lại thời gian chờ 10 giây để thử lại
      timeoutId = setTimeout(() => {
        handleGetProfile();
      }, 10000); // 10 giây
    }
  };

  useEffect(() => {
    // Gọi API lần đầu tiên
    handleGetProfile();

    // Cleanup function để clear timeout khi component unmount
    return () => clearTimeout(timeoutId);
  }, []);



 

  return (
   
    <div className="min-h-[100vh] w-full flex flex-col items-center  gap-10 text-white  ">
      {/* Banner */}
      <Banner isFirstLoad={isFirstLoad} platId={userData?.plat_id}/>
      

      {/* Profile */}
      <div className="w-full h-full bg-[url('/BackgroundProfile.png')] bg-no-repeat bg-cover bg-center">
      <div className="max-w-screen-xl w-full mx-auto pt-[100px] pb-10 flex lg:flex-row flex-col gap-[43px] px-5 ">
        <ConnectedAccount user={userData}  isFirstLoad={isFirstLoad}/>

        <div className="flex flex-col gap-8 lg:max-w-[706px] w-full">
          <YourUnifiedIdProfile data={userData} isFirstLoad={isFirstLoad}/>

          <ConnectedPlatsApp />
        </div>
      </div>
      </div>

      
    </div>
  );
};


