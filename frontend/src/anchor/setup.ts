import { IdlAccounts, Program } from "@coral-xyz/anchor";
import type { Counter } from "./idlType";
import idl from "./idl.json";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { SOL_ADDRESS } from "@/lib/env.config";
import { endpoint } from '@/lib/helper';

const programId = new PublicKey(SOL_ADDRESS ?? "")
const connection = new Connection(endpoint, "confirmed");
 

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
export const program = new Program(idl as Counter, {
  connection,
});
 

export const [mintPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("mint")],
  program.programId
);


export const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  program.programId,
);
 
// This is just a TypeScript type for the Counter data structure based on the IDL
// We need this so TypeScript doesn't yell at us
export type CounterData = IdlAccounts<Counter>["counter"];