"use client";
import authApiRequest from "@/apiRequest/auth";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const LogoutPage = () => {
  const route = useRouter();

  const handleLogout = useCallback(async () => {
    await authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
      console.log("logged out");
      route.push(`/login`);
    });
  }, [route]);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);
  return <div className="h-[100vh] bg-[#08082C]"></div>;
};

export default LogoutPage;
