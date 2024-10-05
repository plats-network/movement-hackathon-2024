import {
    Account,
    Aptos,
    AptosConfig,
    Network,
    Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";
import dotenv from "dotenv";
dotenv.config();

class MovementClient {
    private config: AptosConfig;
    private MODULE_ADDRESS: string;
    private REGISTER_IDENTITY_FUNCTION: `${string}::${string}::${string}`;
    private FETCH_IDENTITY_FUNCTION: `${string}::${string}::${string}`;
    private GET_SLAVES_ACCOUNTS_FUNCTION: `${string}::${string}::${string}`;
    private GET_PERMISSIONS_FUNCTION: `${string}::${string}::${string}`;
    private UPDATE_IDENTITY_FUNCTION: `${string}::${string}::${string}`;
    private ADD_IDENTITY_FUNCTION: `${string}::${string}::${string}`;
    private GRANT_PERMISSIONS_FUNCTION: `${string}::${string}::${string}`;
    private REVOKE_PERMISSIONS_FUNCTION: `${string}::${string}::${string}`;
    private PRIVATE_KEY: string;
    private account: Account;
    private aptos: Aptos;

    constructor() {
        this.config = new AptosConfig({
            network: Network.CUSTOM,
            fullnode: "https://aptos.testnet.suzuka.movementlabs.xyz/v1",
            faucet: "https://faucet.testnet.suzuka.movementlabs.xyz",
        });
        this.MODULE_ADDRESS =
            "0x4e87d8b7cceaedd5ae81c213daade2b451003c8205bbc71231223c9457c45467";
        this.REGISTER_IDENTITY_FUNCTION = `${this.MODULE_ADDRESS}::plats_id::register_identity`;
        this.FETCH_IDENTITY_FUNCTION = `${this.MODULE_ADDRESS}::plats_id::get_secret_identity`;
        this.GET_PERMISSIONS_FUNCTION = `${this.MODULE_ADDRESS}::plats_id::get_permissions_identity`;
        this.GET_SLAVES_ACCOUNTS_FUNCTION = `${this.MODULE_ADDRESS}::plats_id::get_slaves_account_identity`;
        this.UPDATE_IDENTITY_FUNCTION = `${this.MODULE_ADDRESS}::plats_id::update_identity`;
        this.ADD_IDENTITY_FUNCTION = `${this.MODULE_ADDRESS}::plats_id::add_identity`;
        this.GRANT_PERMISSIONS_FUNCTION = `${this.MODULE_ADDRESS}::plats_id::add_permissions`;
        this.REVOKE_PERMISSIONS_FUNCTION = `${this.MODULE_ADDRESS}::plats_id::revoke_permissions`;
        this.PRIVATE_KEY = process.env.PRIVATE_KEY || "";
        this.account = Account.fromPrivateKey({
            privateKey: new Ed25519PrivateKey(this.PRIVATE_KEY),
        });
        this.aptos = new Aptos(this.config);
    }
    registerIdentity = async (
        address: string,
        platId: string,
        storeIds: string[],
        secretNames: string[] = [
            "secret_balance",
            "secret_volume",
            "secret_twitter",
        ],
    ) => {
        // Create an account from the provided private key
        console.log("creating");
        const accountAddress = this.account.accountAddress;

        console.log(`address: ${accountAddress}`);

        console.log(`Using account: ${accountAddress}`);

        // Submit the transaction
        console.log("\n=== Submitting Transaction ===\n");
        const transaction = await this.aptos.transaction.build.simple({
            sender: accountAddress,
            data: {
                function: this.REGISTER_IDENTITY_FUNCTION,
                functionArguments: [
                    `${address}`,
                    `${platId}`,
                    storeIds,
                    secretNames,
                ],
            },
        });

        // Sign the transaction
        const signature = this.aptos.transaction.sign({
            signer: this.account,
            transaction,
        });

        // Submit the transaction to chain
        const committedTxn = await this.aptos.transaction.submit.simple({
            transaction,
            senderAuthenticator: signature,
        });

        console.log(`Submitted transaction: ${committedTxn.hash}`);
        const response = await this.aptos.waitForTransaction({
            transactionHash: committedTxn.hash,
        });
        return response.success;
    };

    fetchIdentity = async (platId: string) => {
        const accountAddress = this.account.accountAddress;
        console.log(`Using account: ${accountAddress}`);
        console.log("\n=== Fetching Identity ===\n");

        const viewPayload = {
            function: this.FETCH_IDENTITY_FUNCTION,
            functionArguments: [accountAddress, platId],
        };
        const permissionsPayload = {
            function: this.GET_PERMISSIONS_FUNCTION,
            functionArguments: [accountAddress, platId],
        };

        const slavesPayload = {
            function: this.GET_SLAVES_ACCOUNTS_FUNCTION,
            functionArguments: [accountAddress, platId],
        };
        const identity = await this.aptos.view({ payload: viewPayload });
        const permissions = await this.aptos.view({
            payload: permissionsPayload,
        });
        const slaves = await this.aptos.view({ payload: slavesPayload });
        return {
            secret_balance: (identity[0] as []).map((x: any) => x.store_id),
            secret_volume: (identity[1] as []).map((x: any) => x.store_id),
            secret_twitter: (identity[2] as []).map((x: any) => x.store_id),
            permissions: permissions[0],
            slaves: slaves[0],
        };
    };
    addIdentity = async (
        address: string,
        platId: string,
        storeIds: string[],
        secretNames: string[] = [
            "secret_balance",
            "secret_volume",
            "secret_twitter",
        ],
    ) => {
        const accountAddress = this.account.accountAddress;
        console.log(`Using account: ${accountAddress}`);
        console.log("\n=== Adding Identity ===\n");

        const transaction = await this.aptos.transaction.build.simple({
            sender: accountAddress,
            data: {
                function: this.ADD_IDENTITY_FUNCTION,
                functionArguments: [
                    `${address}`,
                    `${platId}`,
                    storeIds,
                    secretNames,
                ],
            },
        });

        const signature = this.aptos.transaction.sign({
            signer: this.account,
            transaction,
        });

        const committedTxn = await this.aptos.transaction.submit.simple({
            transaction,
            senderAuthenticator: signature,
        });

        console.log(`Submitted transaction: ${committedTxn.hash}`);
        const response = await this.aptos.waitForTransaction({
            transactionHash: committedTxn.hash,
        });
        return response.success;
    };

    updateIdentity = async (
        address: string,
        platId: string,
        storeIds: string[],
        secretNames: string[] = [
            "secret_balance",
            "secret_volume",
            "secret_twitter",
        ],
    ) => {
        const accountAddress = this.account.accountAddress;
        console.log(`Using account: ${accountAddress}`);
        console.log("\n=== Updating Identity ===\n");

        const transaction = await this.aptos.transaction.build.simple({
            sender: accountAddress,
            data: {
                function: this.UPDATE_IDENTITY_FUNCTION,
                functionArguments: [
                    `${address}`,
                    `${platId}`,
                    storeIds,
                    secretNames,
                ],
            },
        });

        const signature = this.aptos.transaction.sign({
            signer: this.account,
            transaction,
        });

        const committedTxn = await this.aptos.transaction.submit.simple({
            transaction,
            senderAuthenticator: signature,
        });

        console.log(`Submitted transaction: ${committedTxn.hash}`);
        const response = await this.aptos.waitForTransaction({
            transactionHash: committedTxn.hash,
        });
        return response.success;
    };
    grantPermissions = async (
        address: string,
        platId: string,
        appIds: string[],
    ) => {
        const accountAddress = this.account.accountAddress;
        console.log(`Using account: ${accountAddress}`);
        console.log("\n=== Granting Permissions ===\n");

        const transaction = await this.aptos.transaction.build.simple({
            sender: accountAddress,
            data: {
                function: this.GRANT_PERMISSIONS_FUNCTION,
                functionArguments: [`${address}`, `${platId}`, appIds],
            },
        });

        const signature = this.aptos.transaction.sign({
            signer: this.account,
            transaction,
        });

        const committedTxn = await this.aptos.transaction.submit.simple({
            transaction,
            senderAuthenticator: signature,
        });

        console.log(`Submitted transaction: ${committedTxn.hash}`);
        const response = await this.aptos.waitForTransaction({
            transactionHash: committedTxn.hash,
        });
        return response.success;
    };
}
export const movementClient = new MovementClient();
