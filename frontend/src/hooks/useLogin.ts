import authApiRequest from "@/apiRequest/auth";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { decodeUTF8 } from "tweetnacl-util";

import React, { useEffect, useState } from "react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";

declare global {
    interface Window {
      pontem?: {
        signMessage: (params: {
          address?: boolean;
          application?: boolean;
          chainId?: boolean;
          message: string | Uint8Array;
          nonce: string;
        }) => Promise<any>;
      };
    }
  }
  


const useLogin = () => {
    const { connected, account, disconnect, wallets, select } = useWallet();
 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authenToken, setAuthenToken] = useState<string>("");
  const [isConnect, setIsConnect] = useState<boolean>(false);
  const [currentPublicKey, setCurrentPublicKey] = useState<any>(null);


  const handleGetNonce = async () => {
    try {
      setIsLoading(true);
      if (!account?.publicKey) return;
      console.log("currentPublicKey",account.publicKey)
      // Get nonce
      const publicKeyWallet = Buffer.from(account.publicKey.toString()).toString(
        "base64"
      );
      
      console.log("publickey get Nonce base 64", publicKeyWallet);
      const responseNonce = await authApiRequest.nonce(
        encodeURIComponent(publicKeyWallet)
      );
      console.log("🚀 ~ handleGetNonce ~ responseNonce:", responseNonce)

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
    // try {
     
    // const message = new TextEncoder().encode(nonce);
    //   const signedMessage = await phantomProvider.signMessage(
    //     encodedMessage,
    //     "utf8"
    //   );


    const encodedMessage = decodeUTF8(nonce);
    console.log("🚀 ~ handleGetSignature ~ message:", encodedMessage)

    if (typeof window !== 'undefined' && window.pontem) {
        
          try {
            const resultMessage = await window?.pontem?.signMessage({
              address: true,
              application: true,
              chainId: true,
              message: encodedMessage,
              nonce: nonce,
            });
            console.log('Signed Message', resultMessage?.result?.signature );

      //verify
      if (resultMessage) {
        handleVerifySignature(resultMessage?.result?.signature);
      }
          } catch (e) {
            console.log('Error', e);
            setIsLoading(false);

            toast({
              variant: "destructive",
              className: "z-50 text-white",
              description: "Connect wallet failed",
            });
          }
        
  

 
    }
  };

  const handleVerifySignature = async (signature: string) => {
    try {
      if (!account?.publicKey) return;

      const data = {
        public_key: Buffer.from(account.publicKey.toString()).toString("base64"),
        signature: Buffer.from(signature).toString("base64"),
      };

      const responseVerify = await authApiRequest.verify(data);
      console.log("🚀 ~ handleVerifySignature ~ responseVerify:", responseVerify)

      toast({
        className: "z-50 text-white",
        description: responseVerify.payload.msg,
      });
    //   if (responseVerify) {
    //     const responseLogin = await authApiRequest.login(
    //       responseVerify.payload.data.authen_token
    //     );

    //     if (responseLogin && responseLogin?.payload.code !== 400) {
    //       await authApiRequest.auth({
    //         accessToken: responseLogin.payload.data.access_token,
    //       });
    //       toast({
    //         className: "z-50 text-white",
    //         description: "Login successful",
    //       });
    //       router.push("/");
    //       router.refresh();
    //     } else {
    //       setAuthenToken(responseVerify.payload.data.authen_token);
    //     }
    //   }
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

 
  return {
    isLoading,
    isConnect,
    handleGetNonce,
    authenToken,
    setIsConnect,
    currentPublicKey
  };
};

export default useLogin;
