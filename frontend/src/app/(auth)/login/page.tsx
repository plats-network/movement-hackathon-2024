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
  const [isConnect, setIsConnect] = useState<boolean>(false);

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
        encodeURIComponent(publicKeyWallet)
      );

      // Sign message
      if (responseNonce) {
        handleGetSignature(responseNonce.payload.data.nonce);
      }
    } catch (error) {
      setIsLoading(false);

      toast({
        variant: "destructive",
        className: "z-50 text-white",
        description: "Connect wallet failed",
      });
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
      setIsLoading(false);

      toast({
        variant: "destructive",
        className: "z-50 text-white",
        description: "Connect wallet failed",
      });
    }
  };

  const handleVerifySignature = async (signature: string) => {
    try {
      if (!publicKey) return;

      const data = {
        public_key: Buffer.from(publicKey.toBytes()).toString("base64"),
        signature: Buffer.from(signature).toString("base64"),
      };

      const responseVerify = await authApiRequest.verify(data);

      toast({
        className: "z-50 text-white",
        description: responseVerify.payload.msg,
      });
      if (responseVerify) {
        const responseLogin = await authApiRequest.login(
          responseVerify.payload.data.authen_token
        );

        if (responseLogin && responseLogin?.payload.code !== 400) {
          await authApiRequest.auth({
            accessToken: responseLogin.payload.data.access_token,
          });
          toast({
            className: "z-50 text-white",
            description: "Login successful",
          });
          router.push("/");
          router.refresh();
        } else {
          setAuthenToken(responseVerify.payload.data.authen_token);
        }
      }
    } catch (error) {
      console.log("🚀 ~ handleVerifySignature ~ error:", error);
      setIsLoading(false);

      toast({
        variant: "destructive",
        className: "z-50 text-white",
        description: "Connect wallet failed",
      });
    }
  };

  return (
    <div className="h-[100vh] w-full py-[97px] flex items-center justify-center  text-white px-10 ">
      <div className=" flex h-full  shadow w-full max-w-6xl m-auto rounded-2xl gradient-border-mask-box ">
        <div className="w-full h-full md:flex hidden flex-col items-center justify-between text-center bg-[url('/LoginBackground.png')] bg-no-repeat bg-cover bg-center py-[27px]">
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

        <div className="relative  h-full w-full">
          <div
            className="absolute inset-0  opacity-5 shadow w-full h-full  rounded-r-2xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(25,5,50,1),rgba(102,255,255,1) 0%)",
            }}
          ></div>

          {!authenToken ? (
            <div className="relative w-full h-full flex flex-col  py-[74px] px-[27px] gap-[120px]  z-50">
              <div className="w-full flex items-center justify-between">
                <p className="text-[28px] font-semibold">Login</p>

                <button
                  //   onClick={() => router.push("/")}
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className=" ">
                <WalletButton
                  isConnect={isConnect}
                  isLoading={isLoading}
                  handleGetNonce={handleGetNonce}
                />
                <div className="w-full flex flex-col gap-5">
                  <div className="flex gap-[10px] pt-4">
                    <Checkbox
                      checked={isConnect}
                      onClick={() => setIsConnect(!isConnect)}
                      className="border-[#3AE7E7]  w-5 h-5 bg-[#303C50]"
                    />

                    <p className="text-base">
                      By continuing, you agree to the updated{" "}
                      <strong>Terms of Sale, Terms of Service,</strong> and{" "}
                      <strong>Privacy Policy.</strong>
                    </p>
                  </div>
                  {/* <div className="flex items-center justify-center mt-10 mb-5 gap-2">
                  <div className="w-full h-[0.4px] bg-[#6E6E6E]" />
                  <p className="text-xl text-nowrap">Or login with</p>
                  <div className="w-full h-[0.4px] bg-[#6E6E6E]" />
                </div> */}

                  {/* <button className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white text-base cursor-pointer rounded-xl">
                  <GoogleIcon />
                  <p> Continue with Google</p>
                </button>
                <div className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white  text-base cursor-pointer rounded-xl">
                  <TelegramIcon />
                  <p> Continue with telegram</p>
                </div>
                <div className="flex items-center justify-center gap-2 bg-[#1A1A36] w-full py-4  text-white text-base cursor-pointer rounded-xl">
                  <TwitterIcon />
                  <p> Continue with twitter</p>
                </div> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col justify-between p-6">
              <RegisterIdForm authenToken={authenToken} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
