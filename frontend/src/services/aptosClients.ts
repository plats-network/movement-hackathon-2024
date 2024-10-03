import { AptosClient } from "aptos";

import {RPC_URL} from "@/lib/utils";

export const getAptosClient = () => new AptosClient(RPC_URL);