import { AnchorProvider, BorshCoder, Program, Wallet } from "@coral-xyz/anchor";
import { IDL } from "../idl/plats_id";
import {
    ComputeBudgetProgram,
    Connection,
    Context,
    KeyedAccountInfo,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
} from "@solana/web3.js";

import { getIdentityPDA, Identity, simulateSendAndConfirmTX } from "./utils";
import * as fs from "fs";
import * as bip39 from "bip39";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import dotenv from "dotenv";
dotenv.config();

let program: Program<typeof IDL> | null = null;
let connection: Connection;
let keypair: Keypair;
/**
 * Converts a PublicKey to a base64 string.
 * @param publicKey - The PublicKey object to convert.
 * @returns The base64 string representation of the PublicKey.
 */
const convertPublicKeyToBase64 = (publicKey: PublicKey): string => {
    return publicKey.toBuffer().toString("base64");
};
const initializeProgram = () => {
    const user = Keypair.generate();
    console.log("Seed User Base64:", convertPublicKeyToBase64(user.publicKey));
    if (!program) {
        connection = new Connection(process.env.RPC_URL, {
            commitment: "confirmed",
            confirmTransactionInitialTimeout: 10000,
        });

        const seed = bip39.mnemonicToSeedSync(
            process.env.MNEMONIC_PHRASE || "",
            "",
        );
        keypair = Keypair.fromSeed(seed.slice(0, 32));
        const wallet = new Wallet(keypair);

        const provider: AnchorProvider = new AnchorProvider(
            connection,
            wallet,
            {
                preflightCommitment: "confirmed",
                commitment: "confirmed",
            },
        );
        program = new Program(IDL, provider);
    }
    return program;
};
const getNameID = (plat_id: string) => plat_id + ".ID";
const registerIdentity = async (base64: string, plat_id: string) => {
    try {
        const userPublicKey = convertBase64toPublicKey(base64);
        const computeBudgetInstruction =
            ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 100000,
            });

        const computeBudgetLimitInstruction =
            ComputeBudgetProgram.setComputeUnitLimit({
                units: 120000,
            });
        const EMPTY_VALUE = "";
        const storeIdBalance = EMPTY_VALUE;
        const secretNameBalance = "secret_balance";

        const storeIdVolume = EMPTY_VALUE;
        const secretNameVolume = "secret_volume";

        const storeIdTwitter = EMPTY_VALUE;
        const secretNameTwitter = "secret_twitter";

        const nameId = getNameID(plat_id);
        console.log("NameID:", nameId);
        const instruction = await program.methods
            .registerIdentity(
                nameId,
                [storeIdBalance, storeIdVolume, storeIdTwitter],
                [secretNameBalance, secretNameVolume, secretNameTwitter],
                1,
            )
            .accounts({
                // @ts-ignore
                identity: getIdentityPDA(userPublicKey),
                owner: userPublicKey,
            })
            .instruction();

        const confirmation = await simulateSendAndConfirmTX(
            [
                computeBudgetInstruction,
                computeBudgetLimitInstruction,
                instruction,
            ],
            keypair,
            connection,
        );

        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(
            "Confirmed! Your transaction signature",
            confirmation.signature,
        );
        // const indentity = getIdentity(userPublicKey);
        // console.log("Identity:", indentity);
        // return indentity;
        return { secretNameBalance, secretNameVolume, secretNameTwitter };
    } catch (err) {
        console.log(err);
    }
};
const convertBase64toBase58 = (base64: string) => {
    const userBytes = Buffer.from(base64, "base64");
    const userBase58 = bs58.encode(userBytes);
    return userBase58;
};

const convertBase64toPublicKey = (base64: string) => {
    const userBase58 = convertBase64toBase58(base64);
    const userPublicKey = new PublicKey(userBase58);
    return userPublicKey;
};
// const getIdentity = (userPublicKey: PublicKey) => {
//     const identity = getIdentityPDA(userPublicKey);
//     return identity.toBase58();
// };

const fetchIdentity = async (base64: string) => {
    const userPublicKey = convertBase64toPublicKey(base64);
    const data = await program.account.identity.fetch(
        getIdentityPDA(userPublicKey),
    );
    console.log("ID:", data.nameId);
    console.log("Infos:", JSON.stringify(data.infos));
    return data.infos.reduce<{ [key: string]: any }>((acc, info) => {
        acc[info.secretName] = info.storeId;
        return acc;
    }, {});
};

const updateIdentity = async (
    base64: string,
    platId: string,
    storeIdBalance: string,
    secretNameBalance: string = "secret_balance",
    storeIdVolume: string,
    secretNameVolume: string = "secret_volume",
    storeIdTwitter: string,
    secretNameTwitter: string = "secret_twitter",
) => {
    const userPublicKey = convertBase64toPublicKey(base64);
    const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100000,
    });

    const computeBudgetLimitInstruction =
        ComputeBudgetProgram.setComputeUnitLimit({
            units: 120000,
        });

    const nameId = getNameID(platId);

    const instruction = await program.methods
        .updateIdentity(
            nameId,
            [storeIdBalance, storeIdVolume, storeIdTwitter],
            [secretNameBalance, secretNameVolume, secretNameTwitter],
        )
        .accounts({
            // @ts-ignore
            identity: getIdentityPDA(userPublicKey),
            owner: userPublicKey,
        })
        .instruction();

    const confirmation = await simulateSendAndConfirmTX(
        [computeBudgetInstruction, computeBudgetLimitInstruction, instruction],
        keypair,
        connection,
    );

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("Your transaction signature", confirmation.signature);
};

export { initializeProgram, registerIdentity, fetchIdentity, updateIdentity };
