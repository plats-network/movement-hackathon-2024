"use client";
import authApiRequest from "@/apiRequest/auth";
import CloseIcon from "@/assets/CloseIcon";
import GoogleIcon from "@/assets/GoogleIcon";
import TelegramIcon from "@/assets/TelegramIcon";
import TwitterIcon from "@/assets/TwitterIcon";
import WalletIcon from "@/assets/WalletIcom";
import RegisterIdForm from "@/components/RegisterIdForm";
import WalletButton from "@/components/shared/WalletButton";
import { Checkbox } from "@/components/ui/checkbox";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { decodeUTF8 } from "tweetnacl-util";

import React, { useState } from "react";

import getProviderPhantom from "@/hooks/getProviderPhantom";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authenToken, setAuthenToken] = useState<string>("");
  

  const phantomProvider = getProviderPhantom(); // see "Detecting the Provider"

  const handleGetNonce = async () => {
    try {
      setIsLoading(true);
      if (!publicKey) return;
      // Get nonce
      const publicKeyWallet = Buffer.from(publicKey.toBytes()).toString(
        "base64"
      );
      console.log("publickey get Nonce", publicKeyWallet);
      const responseNonce = await authApiRequest.nonce(
        publicKeyWallet
      );
      console.log(
        "🚀 ~ handleGetNonce ~ responseNonce:",
        responseNonce?.data?.data.nonce
      );

      // cho 5 s
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Sign message
      if (responseNonce) {
        handleGetSignature(responseNonce?.data?.data.nonce);
      }
    } catch (error) {
     
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSignature = async (nonce: string) => {
    try {
      if (!phantomProvider) return;
      const encodedMessage = decodeUTF8(nonce);
      const signedMessage = await phantomProvider.signMessage(
        encodedMessage,
        "utf8"
      );
     
      // verify
      if (signedMessage) {
        handleVerifySignature(signedMessage.signature);
      }
    } catch (error) {
    console.log("🚀 ~ handleGetSignature ~ error:", error)
   
    }
  };

  const handleVerifySignature = async (signature: string) => {
    try {
      if (!publicKey) return;

      const data = {
        public_key: Buffer.from(publicKey.toBytes()).toString("base64"),
        signature: Buffer.from(signature).toString("base64"),
      };

      const responseVerify = await authApiRequest.verifyFromClientToServer(
        data
      );
      toast({
        className:"z-50 text-white",
        description: responseVerify.data.message,
      });
      if(responseVerify) {
        const responseLogin = await authApiRequest.login(responseVerify.data.data.authen_token)
      
        if(responseLogin && responseLogin?.data.code !== 400) {
          toast({
            className:"z-50 text-white",
            description: responseLogin.data.msg,
          });
          console.log("🚀 ~ handleRegister ~ responseLogin:", responseLogin)
          await authApiRequest.auth({accessToken: responseLogin.data.data.access_token})
          router.push("/id-management")
        }
        else {
          setAuthenToken(responseVerify.data.data.authen_token)
        }
   

      }
     
     
    } catch (error) {
      console.log("🚀 ~ handleVerifySignature ~ error:", error)
      
    } 
  };

 

  return (
    <div className="h-[100vh] w-full py-[97px] flex items-center justify-center  text-white">
      <div className="relative  h-full">
        <div
          className="absolute inset-0  opacity-5 shadow w-full max-w-6xl m-auto rounded-2xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(25,5,50,1),rgba(102,255,255,1) 0%)",
          }}
        ></div>
        <div className="relative z-10  flex h-full  shadow w-full max-w-6xl m-auto rounded-2xl  ">
          {/* <div className="flex h-full shadow w-full max-w-6xl m-auto rounded-2xl bg-[#08082C]"> */}
          {/* left */}
          <div className="w-full h-full flex flex-col items-center justify-between text-center bg-[url('/LoginBackground.png')] bg-no-repeat bg-cover bg-center py-[27px]">
            <div className="relative max-w-[505px] w-full h-[437px]">
              <Image
                alt="img-login"
                src={"/LoginGroup.png"}
                sizes="100%"
                fill
                objectFit="contain"
              />
            </div>
            <p className="text-[54px] font-semibold">
              We are all stand on <span className="text-[#3AE7E7]">Plats</span>
            </p>
          </div>
         
          {!authenToken ? (
          <div className="w-full h-full flex flex-col justify-between py-[74px] px-[27px]">
            <div className="w-full flex items-center justify-between">
              <p className="text-[28px] font-semibold">Login</p>

              <button
                onClick={() => router.push("/")}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
              >
                <CloseIcon />
              </button>
            </div>

            <div className=" ">
                <WalletButton handleGetNonce={handleGetNonce} />


              <div className="w-full flex flex-col gap-5">
                <div className="flex gap-[10px] pt-4">
                  <Checkbox className="border-[#3AE7E7]  w-5 h-5 bg-[#303C50]" />

                  <p className="text-base">
                    By continuing, you agree to the updated{" "}
                    <strong>Terms of Sale, Terms of Service,</strong> and{" "}
                    <strong>Privacy Policy.</strong>
                  </p>
                </div>
                <div className="flex items-center justify-center mt-10 mb-5 gap-2">
                  <div className="w-full h-[0.4px] bg-[#6E6E6E]" />
                  <p className="text-xl text-nowrap">Or login with</p>
                  <div className="w-full h-[0.4px] bg-[#6E6E6E]" />
                </div>

                <div className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white text-base cursor-pointer rounded-xl">
                  <GoogleIcon />
                  <p> Continue with Google</p>
                </div>
                <div className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white  text-base cursor-pointer rounded-xl">
                  <TelegramIcon />
                  <p> Continue with telegram</p>
                </div>
                <div className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white text-base cursor-pointer rounded-xl">
                  <TwitterIcon />
                  <p> Continue with twitter</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-between p-6">
        

            <RegisterIdForm authenToken={authenToken}/>
          </div>
        )}
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
