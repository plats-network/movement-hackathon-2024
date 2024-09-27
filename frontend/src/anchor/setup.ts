import { IdlAccounts, Program, utils } from "@coral-xyz/anchor";
import type { PlatsId } from "./idlType";
import idl from "./idl.json";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { SOL_ADDRESS } from "@/lib/env.config";
import { endpoint } from '@/lib/helper';


const connection = new Connection(endpoint, "confirmed");
 

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
export const program = new Program(idl as PlatsId, {
  connection,
});
 


export const getIdentityPDA = (nameId: string) => {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("identity"),
      Buffer.from(nameId)
    ],
    program.programId
  );
  return pda;
};
 
// This is just a TypeScript type for the Counter data structure based on the IDL
// We need this so TypeScript doesn't yell at us
export type PlatsData = IdlAccounts<PlatsId>["identity"];