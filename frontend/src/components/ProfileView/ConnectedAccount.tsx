import DeleteIcon from "@/assets/DeleteIcon";
import GoogleIcon from "@/assets/GoogleIcon";
import TelegramIcon from "@/assets/TelegramIcon";
import TwitterIcon from "@/assets/TwitterIcon";
import WalletIcon from "@/assets/WalletIcom";
import ConnectAccountModal from "@/components/ConnectAccountModal";
import { sliceAddressWallet, sliceAddressWalletUser } from "@/lib/helper";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import React, { useEffect, useState } from "react";

const ConnectedAccount = ({
  user,
  isFirstLoad,
}: {
  user: any;
  isFirstLoad: boolean;
}) => {

  const { publicKey } = useWallet(); // Get the current public key from the wallet adapter

  const [currentPublicKey, setCurrentPublicKey] = useState<any>(null)
    useEffect(() => {
    if (publicKey) {
      console.log("🚀 ~ useEffect ~ publicKey:", publicKey.toBase58())
      setCurrentPublicKey(publicKey); // Convert publicKey to string (base58)
    } else {
      setCurrentPublicKey(null); // Xử lý khi không có publicKey (chưa connect)
    }
  }, [publicKey]); // Chạy lại khi giá trị publicKey thay đổi

  useEffect(() => {
    const provider = window.solana;

    if (provider && provider.isPhantom) {
      provider.on("accountChanged", (newPublickey: PublicKey) => {
        console.log("New wallet public key:", newPublickey?.toBase58());
        // Handle the new wallet address
        setCurrentPublicKey(newPublickey);
      });
    }

   
  }, []);

  return (
    <div className="relative w-full z-10  lg:max-w-[455px]">
      <div
        className="absolute inset-0 rounded-xl  from-[#190532] opacity-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(25,5,50,1),rgba(102,255,255,1) 0%)",
        }}
      ></div>
      <div className="relative z-10 h-full flex flex-col  gap-8 p-5 ">
        <p className="text-xl text-[#3AE7E7] font-semibold">
          Connected Account
        </p>
        {user?.twitter_name || user?.address ? (
          <div className="flex flex-col gap-3 h-[260px] overflow-y-scroll " style={{
            scrollbarWidth:'none'
          }}>
            {user?.address &&
              user?.address.map((address: string, index: number) => (
                <div
                  key={index}
                  className="bg-[#1E2536] flex items-center py-[18px] px-[10px] gap-[20px] rounded-[8px] box-gradient-border-mask"
                >
                  <div className="flex items-center gap-2">
                    <WalletIcon />
                    <p>{sliceAddressWalletUser(address)}</p>
                  </div>

                  {/* <div className="flex gap-3">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="relative w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]"></div>
                </label>
                <DeleteIcon />
              </div> */}
                </div>
              ))}

       

     

            {
              //  user?.twitter_name !== -1 || user?.twitter_name
              user?.twitter_name !== -1 && user?.twitter_name && (
                <div className="bg-[#1E2536] flex items-center justify-between py-[18px] px-[10px] gap-[20px] rounded-[8px] box-gradient-border-mask">
                  <div className="flex items-center gap-2">
                    <TwitterIcon />
                    <p>{user?.twitter_name}</p>
                  </div>

                  {/* <div className="flex gap-3">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[4px] after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]"></div>
            </label>
            <DeleteIcon />
          </div> */}
                </div>
              )
            }
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-3 h-[260px]">
            <p className="text-[40px] font-bold">- -</p>
            <p className="text-[17px] text-[#B172FF]">
              You haven't connected to any accounts yet
            </p>
          </div>
        )}

        <ConnectAccountModal
          platId={user?.plat_id}
          listAddress={user?.address}
          currentPublicKey={currentPublicKey}
        />
      </div>
    </div>
  );
};

export default ConnectedAccount;
