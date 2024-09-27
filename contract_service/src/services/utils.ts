import {
    Connection,
    Keypair,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";
import { PlatsId } from "../idl/plats_id";
import { IdlAccounts, utils, BN } from "@coral-xyz/anchor";
import "dotenv/config";
import bs58 from "bs58";

export const programId = new PublicKey(
    "4ASkhwUReTWmvp8aLASbD8ppbcEMBxhcQmGHDbXMh7iN",
);

export const getIdentityPDA = (nameId: string) => {
    const [pda] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("identity"), Buffer.from(nameId)],
        programId,
    );
    return pda;
};

export const simulateSendAndConfirmTX = async (
    instructions: TransactionInstruction[],
    payer: Keypair,
    connection: Connection,
) => {
    const latestBlockhash = await connection.getLatestBlockhash();

    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: instructions,
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([payer]);

    console.log(await connection.simulateTransaction(transaction));
    const signature = await connection.sendTransaction(transaction);

    const confirmed = (
        await connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        })
    ).value;

    return { confirmed, signature };
};

export async function asyncForEach(array: any, callback: any) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// export interface RoomAccountMeta {
//   publicKey: PublicKey;
//   account: IdlAccounts<Dealer>["gameRoom"];
// }

export interface PrivacyInfo {
    storeId: string;
    secretName: string;
    typeInfo: string;
}

export interface Identity {
    owner: string;
    nameId: string;
    infos: PrivacyInfo[];
    bump: number;
}

const base58ToPubKey = (base58: string) => {
    return new PublicKey(base58);
};

const getKeyPairForSecretKeyBase58 = (secretKeyBase58: string) => {
    try {
        return Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
    } catch (e) {
        return undefined;
    }
};

const getKeyPairForSeed = (numArray: Uint8Array) => {
    try {
        return Keypair.fromSeed(Uint8Array.from(numArray));
    } catch (e) {
        return undefined;
    }
};
