"use client";
import WalletIcon from "@/assets/WalletIcom";
import ProfileView from "@/components/ProfileView";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import useSubmitTransaction from "@/hooks/useSubmitTransaction";
import { ellipsize } from "@/lib/utils";
import { useAptos } from "@/providers/AptosContext";
import { moduleToString } from "@/services/moveUtils";
import { useWallet, Wallet } from "@manahippo/aptos-wallet-adapter";
import { TransactionPayload } from "aptos/src/generated";

import React, { useEffect } from "react";

const page = () => {
  const { connected, account, disconnect, wallets, select, wallet } =
    useWallet();
  const { client, updateClient } = useAptos();

  const onConnect = async (wallet: Wallet) => {
    await select(wallet.adapter.name);
  };

  const { submitTransaction } = useSubmitTransaction();

  // Define the module address and functions
  const MODULE_ADDRESS =
    "0x998d7cca2dd5ebf2c0d1ff3000f5f0cd49d409a830ab488fb4436e7392480a29";
  const SET_MESSAGE_FUNCTION = `${MODULE_ADDRESS}::message::set_message`;
  const GET_MESSAGE_FUNCTION = `${MODULE_ADDRESS}::message::get_message`;

  const MESSAGE = "GGhahah";



  const handleSetMessage = async () => {
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::message::set_message`,
        arguments: [MESSAGE],
        type_arguments: [],
      };

      const success = await submitTransaction(payload, {
        title: "Set Message Succeeded",
        description: `You have successfully added`,
      });

      console.log("🚀 ~ setMessage ~ success:", success);
    } catch (error) {
      console.log("🚀 ~ handleSetMessage ~ error:", error);
    }
  };

  const handleGetMessage = async () => {
    try {
      const response = await client.view({
        function: `${MODULE_ADDRESS}::message::get_message`,
        arguments: [account?.address?.toString()],
        type_arguments: [],
      });
      console.log("🚀 ~ handleGetMessage ~ response:", response);
    } catch (error) {
      console.log("🚀 ~ handleGetMessage ~ error:", error);
    }
  };

  useEffect(() => {
    handleGetMessage();
  }, [handleSetMessage]);

  return (
    // <div className="h-[100vh] flex items-center justify-center flex-col">
    //   <LoadingButton
    //     onClick={() => onConnect(wallets[0])}
    //     className="bg-gradient-to-r from-[#8737E9] to-[#3AE7E7]  rounded-xl w-[400px] h-[56px] text-base font-bold flex items-center justify-center gap-2 text-white cursor-pointer"
    //   >
    //     <WalletIcon />
    //     {connected
    //       ? ellipsize(account?.address?.toString(), 8)
    //       : "Connect your wallet"}
    //   </LoadingButton>

    //   <br />
    //   <br />
    //   <Button onClick={handleSetMessage}>Set Message</Button>
    // </div>
    <>
    <ProfileView/>
    </>
  );
};

export default page;
