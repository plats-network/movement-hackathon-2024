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
import { base64, bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
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
const generateKeypair = () => {
    const user = Keypair.generate();
    return {
        secretKey: user.secretKey.toString(),
        pubBase64: convertPublicKeyToBase64(user.publicKey),
        pubBase58: user.publicKey.toBase58(),
    };
};
const initializeProgram = () => {
    const user = Keypair.generate();
    console.log("Seed User Base64:", convertPublicKeyToBase64(user.publicKey));
    console.log("process.env.MNEMONIC_PHRASE", process.env.MNEMONIC_PHRASE);
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

const EMPTY_VALUE = "";
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
        const storeIdBalance = EMPTY_VALUE;
        const secretNameBalance = "secret_balance";

        const storeIdVolume = EMPTY_VALUE;
        const secretNameVolume = "secret_volume";

        const storeIdTwitter = EMPTY_VALUE;
        const secretNameTwitter = "secret_twitter";

        const instruction = await program.methods
            .registerIdentity(
                plat_id,
                [storeIdBalance, storeIdVolume, storeIdTwitter],
                [secretNameBalance, secretNameVolume, secretNameTwitter],
                1,
            )
            .accounts({
                // @ts-ignore
                identity: getIdentityPDA(plat_id),
                masterOwner: userPublicKey,
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

const fetchIdentity = async (plat_id: string) => {
    // const userPublicKey = convertBase64toPublicKey(base64);
    // const data = await program.account.identity.fetch(
    //     getIdentityPDA(userPublicKey),
    // );
    // console.log("ID:", data.nameId);
    // console.log("Infos:", JSON.stringify(data.infos));
    // return data.infos.reduce<{ [key: string]: any }>((acc, info) => {
    //     acc[info.secretName] = info.storeId;
    //     return acc;
    // }, {});
    const accountData = await program.account.identity.fetch(
        getIdentityPDA(plat_id),
    );
    console.log(`Name : ${accountData.nameId}`);
    console.log(`Slave Accounts: ${JSON.stringify(accountData.slaveAccounts)}`);
    console.log(`Balance: ${JSON.stringify(accountData.balancePrivacy)}`);
    console.log(`Volume: ${JSON.stringify(accountData.volumePrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
    console.log(`Permissions: ${JSON.stringify(accountData.permissions)}`);
    const data = {
        permissions: accountData.permissions,
        secret_balance: accountData.balancePrivacy.map(b => b.storeId),
        secret_volume: accountData.volumePrivacy.map(v => v.storeId),
        secret_twitter: accountData.twitterPrivacy.map(t => t.storeId),
        slave_accounts: accountData.slaveAccounts,
    };
    return data;
};

const updateIdentity = async (
    base64: string,
    platId: string,
    storeIdBalance: string,
    storeIdVolume: string,
    storeIdTwitter: string,
) => {
    const userPublicKey = convertBase64toPublicKey(base64);
    const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100000,
    });

    const computeBudgetLimitInstruction =
        ComputeBudgetProgram.setComputeUnitLimit({
            units: 120000,
        });
    const secretNameBalance: string = "secret_balance";
    const secretNameVolume: string = "secret_volume";
    const secretNameTwitter: string = "secret_twitter";

    const instruction = await program.methods
        .updateIdentity(
            platId,
            [storeIdBalance, storeIdVolume, storeIdTwitter],
            [secretNameBalance, secretNameVolume, secretNameTwitter],
        )
        .accounts({
            // @ts-ignore
            identity: getIdentityPDA(platId),
            account: userPublicKey,
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

const addIdentity = async (
    platId: string,
    base64: string,
    storeIdBalance: string = EMPTY_VALUE,
    storeIdVolume: string = EMPTY_VALUE,
    storeIdTwitter: string = EMPTY_VALUE,
) => {
    const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100000,
    });

    const computeBudgetLimitInstruction =
        ComputeBudgetProgram.setComputeUnitLimit({
            units: 120000,
        });

    // convert string base58 to PublicKey
    const userPublicKey = convertBase64toPublicKey(base64);

    const secretNameBalance = "secret_balance";

    const secretNameVolume = "secret_volume";

    const secretNameTwitter = "secret_twitter";

    const instruction = await program.methods
        .addIdentity(
            platId,
            [storeIdBalance, storeIdVolume, storeIdTwitter],
            [secretNameBalance, secretNameVolume, secretNameTwitter],
        )
        .accounts({
            // @ts-ignore
            identity: getIdentityPDA(platId),
            account: userPublicKey,
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

const grantPermissions = async (
    plat_id: string,
    base64: string,
    permissions: string[],
) => {
    const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100000,
    });

    const computeBudgetLimitInstruction =
        ComputeBudgetProgram.setComputeUnitLimit({
            units: 120000,
        });

    // convert string base58 to PublicKey
    const userPublicKey = convertBase64toPublicKey(base64);

    const instruction = await program.methods
        .addPermissions(plat_id, permissions)
        .accounts({
            // @ts-ignore
            identity: getIdentityPDA(plat_id),
            account: userPublicKey,
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

export {
    initializeProgram,
    registerIdentity,
    fetchIdentity,
    updateIdentity,
    grantPermissions,
    addIdentity,
    generateKeypair,
};
