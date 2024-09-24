import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlatsId } from "../target/types/plats_id";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { expect } from "chai";

describe("Plats Id", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PlatsId as Program<PlatsId>;
  const signer = provider.wallet as NodeWallet;
  const users = Array.from({ length: 10 }, () => anchor.web3.Keypair.generate());
  const master_owner = users[0].publicKey;
  console.log("Master Owner:",master_owner);
  const slave_owner1 = users[1].publicKey;
  const slave_owner2 = users[2].publicKey;

  const nameId = "du.ID";

    let [identityPDA, bump] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('identity'),
        Buffer.from(nameId)
      ],
      program.programId
    );
    console.log("identityPDA:", identityPDA);



  it("Should airdrop sol for master account ", async () => {
      await airdropSol(provider.connection, master_owner);
  
      const masterBalance = await provider.connection.getBalance(users[0].publicKey);
  
      expect(masterBalance).to.be.equal(1 * LAMPORTS_PER_SOL);
  })


  it("Register Identity", async () => {


    // Master owner register unique id 
    let storeIdBalance = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volume";

    let storeIdTwitter = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameTwitter = "secret_twitter";

    const transactionSignature = await program.methods
      .registerIdentity(nameId, [storeIdBalance, storeIdVolume,storeIdTwitter ], [secretNameBalance, secretNameVolume, secretNameTwitter], 1)
    .accounts({
      identity: identityPDA,
      masterOwner: master_owner
    })
    .rpc();
  });

  it("Get Identity", async () => {



    const accountData = await program.account.identity.fetch(identityPDA);

    console.log(`Name : ${accountData.nameId}`);
    console.log(`Slave Accounts: ${JSON.stringify(accountData.slaveAccounts)}`);
    console.log(`Balance: ${JSON.stringify(accountData.balancePrivacy)}`);
    console.log(`Volumn: ${JSON.stringify(accountData.volumePrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });


  it("Update  Identity", async () => {


    let storeIdBalance = "c888d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c888d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volume";

    let storeIdTwitter = "c888d3e9-a6c1-438b-a121-295115728f01";
    let secretNameTwitter = "secret_twitter";

    const transactionSignature = await program.methods
      .updateIdentity(nameId, [storeIdBalance, storeIdVolume,storeIdTwitter ], [secretNameBalance, secretNameVolume, secretNameTwitter])
    .accounts({
      identity: identityPDA,
      account: master_owner
    })
    .rpc();
  });

  it("Get Identity After", async () => {



    const accountData = await program.account.identity.fetch(identityPDA);

    console.log(`Name : ${accountData.nameId}`);
    console.log(`Slave Accounts: ${JSON.stringify(accountData.slaveAccounts)}`);
    console.log(`Balance: ${JSON.stringify(accountData.balancePrivacy)}`);
    console.log(`Volumn: ${JSON.stringify(accountData.volumePrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });

  it("Add new slave account 1 to unique  Identity ", async () => {


    let storeIdBalance = "c777d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c777d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volume";

    let storeIdTwitter = "c777d3e9-a6c1-438b-a121-295115728f01";
    let secretNameTwitter = "secret_twitter";

    const transactionSignature = await program.methods
      .addIdentity(nameId, [storeIdBalance, storeIdVolume,storeIdTwitter ], [secretNameBalance, secretNameVolume, secretNameTwitter])
    .accounts({
      identity: identityPDA,
      account: slave_owner1
    })
    .rpc();
  });

  it("Get Identity After Adding new slave account 1", async () => {



    const accountData = await program.account.identity.fetch(identityPDA);

    console.log(`Name : ${accountData.nameId}`);
    console.log(`Slave Accounts: ${JSON.stringify(accountData.slaveAccounts)}`);
    console.log(`Balance: ${JSON.stringify(accountData.balancePrivacy)}`);
    console.log(`Volumn: ${JSON.stringify(accountData.volumePrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });


  it("Add new slave account 2 to unique  Identity ", async () => {


    let storeIdBalance = "c666d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c666d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volume";

    let storeIdTwitter = "c666d3e9-a6c1-438b-a121-295115728f01";
    let secretNameTwitter = "secret_twitter";

    const transactionSignature = await program.methods
      .addIdentity(nameId, [storeIdBalance, storeIdVolume,storeIdTwitter ], [secretNameBalance, secretNameVolume, secretNameTwitter])
    .accounts({
      identity: identityPDA,
      account: slave_owner2
    })
    .rpc();
  });

  it("Get Identity After Adding new slave account 2", async () => {



    const accountData = await program.account.identity.fetch(identityPDA);

    console.log(`Name : ${accountData.nameId}`);
    console.log(`Slave Accounts: ${JSON.stringify(accountData.slaveAccounts)}`);
    console.log(`Balance: ${JSON.stringify(accountData.balancePrivacy)}`);
    console.log(`Volumn: ${JSON.stringify(accountData.volumePrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });

  it("Update  Identity for slave account 1", async () => {


    let storeIdBalance = "c555d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c555d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volume";

    let storeIdTwitter = "c555d3e9-a6c1-438b-a121-295115728f01";
    let secretNameTwitter = "secret_twitter";

    const transactionSignature = await program.methods
      .updateIdentity(nameId, [storeIdBalance, storeIdVolume,storeIdTwitter ], [secretNameBalance, secretNameVolume, secretNameTwitter])
    .accounts({
      identity: identityPDA,
      account: slave_owner1
    })
    .rpc();
  });

  it("Get Identity After slave account 1 updated", async () => {



    const accountData = await program.account.identity.fetch(identityPDA);

    console.log(`Name : ${accountData.nameId}`);
    console.log(`Slave Accounts: ${JSON.stringify(accountData.slaveAccounts)}`);
    console.log(`Balance: ${JSON.stringify(accountData.balancePrivacy)}`);
    console.log(`Volumn: ${JSON.stringify(accountData.volumePrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });


  it("Grant Permissions to app id ", async () => {


    const transactionSignature = await program.methods
      .addPermissions(nameId, ["plats-app-id-1", "plats-app-id-2"])
    .accounts({
      identity: identityPDA,
    }).signers([users[0]]) // master account 
    .rpc();

  });

  it("Get Permissions after grant permissions", async () => {

    const accountData = await program.account.identity.fetch(identityPDA);

    console.log(`Name : ${accountData.nameId}`);
    console.log(`Permissions: ${JSON.stringify(accountData.permissions)}`);
  });

});


async function airdropSol(connection: any, publicKey: PublicKey) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(
      publicKey,
      1 * LAMPORTS_PER_SOL
    )
  );
}

