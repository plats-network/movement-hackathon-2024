
import { toast } from "@/hooks/use-toast";
import { useAptos } from "@/providers/AptosContext";


import { useWallet } from "@manahippo/aptos-wallet-adapter";

import { TransactionPayload, Transaction_UserTransaction } from "aptos/src/generated";



interface ToastMessage {
    title: string;
    description: string;
}

const useSubmitTransaction = () => {

    const { client, updateClient } = useAptos();

    const { signAndSubmitTransaction } = useWallet();


    const submitTransaction = async (transaction: TransactionPayload, toastMessage: ToastMessage): Promise<boolean> => (
        signAndSubmitTransaction(transaction, {checkSuccess: true, maxGasAmount: 1000000})
            .then(async ({hash}) => (
                client.waitForTransactionWithResult(hash)
                    // @ts-ignore
                    .then(async (transaction: Transaction_UserTransaction) => {
                        console.log(transaction);
                        if(transaction.success) {
                            await updateClient();
                            toast({
                                className:"z-50 text-white",
                                title: toastMessage.title,
                                description: toastMessage.description,
                              
                            
                            });
                            return true;
                        } else {
                            toast({
                                className:"z-50 text-white",
                                title: "Transaction failed",
                                description: transaction.vm_status,
                              
                            });
                            return false
                        }
                    })
            ))
            .catch((e) => {
                toast({
                    className:"z-50 text-white",
                    title: "Transaction Failed",
                    description: e.message,
                   
                });
                return false;
            })
    )

    return {
        submitTransaction
    }
}

export default useSubmitTransaction;