'use client'
import { createContext, ReactNode, FC, useContext, useState, useEffect, useCallback } from "react"

import { useWallet } from "@manahippo/aptos-wallet-adapter";

import { AptosClient } from "aptos";

import { getAptosClient } from "@/services/aptosClients";

interface ContextType {
    client: AptosClient;
    updateClient: () => Promise<void>;
}

export const AptosContext = createContext<ContextType>({
    client: getAptosClient(),
    updateClient: async () => {}
});

export const useAptos = () => useContext(AptosContext);

interface AptosContextProps {
    children: ReactNode;
}

export const AptosProvider : FC<AptosContextProps> = ({ children }) => {

    const { network: networkInfo } = useWallet();

    const updateClient = useCallback(async () => {
        setClient(getAptosClient());
    }, []);

    useEffect(() => {
        updateClient();
    }, [networkInfo, updateClient]);


    const [client, setClient] = useState<AptosClient>(getAptosClient());

    return (

        <AptosContext.Provider
            value={{
                client,
                updateClient
            }}
        >
            {children}
        </AptosContext.Provider>
    )
}