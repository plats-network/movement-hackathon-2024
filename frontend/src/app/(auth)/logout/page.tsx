"use client";
import authApiRequest from "@/apiRequest/auth";
import { clientAccessToken } from "@/lib/http";
import {  usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const LogoutPage = () => {
  // const route = useRouter();

  // const handleLogout = useCallback(async () => {
  //   await authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
  //     console.log("logged out");
  //     route.push(`/login`);
  //   });
  // }, [route]);

  // useEffect(() => {
  //   handleLogout();
  // }, [handleLogout]);
  const route = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");

  const handleLogout = useCallback(async () => {
    await authApiRequest.logoutFromNextClientToNextServer(true).then((res) => {
      console.log("logged out");
      route.push(`/login`);
    });
  }, [route, pathname]);

  useEffect(() => {
    if (accessToken === clientAccessToken?.value) {
      handleLogout();
    }
  }, [accessToken, handleLogout]);
  return <div className="h-[100vh]"></div>;
};

export default LogoutPage;
