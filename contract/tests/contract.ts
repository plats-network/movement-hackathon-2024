import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PlatsId } from "../target/types/plats_id";
import { PublicKey } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

describe("Plats Id", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PlatsId as Program<PlatsId>;
  const signer = provider.wallet as NodeWallet;
  const users = Array.from({ length: 10 }, () => anchor.web3.Keypair.generate());
  const master_owner = users[0].publicKey;

  const slave_owner1 = users[1].publicKey;
  const slave_owner2 = users[2].publicKey;

    let [identityPDA, bump] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('identity'),
        Buffer.from("Linh.ID")
      ],
      program.programId
    );
    console.log("identityPDA:", identityPDA);



  it("Register Identity", async () => {


    // Master owner register unique id 
    let nameId = "Linh.ID";
    let storeIdBalance = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volumn";

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
    console.log(`Volumn: ${JSON.stringify(accountData.volumnPrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });


  it("Update  Identity", async () => {


    let nameId = "Linh.ID";
    let storeIdBalance = "c888d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c888d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volumn";

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
    console.log(`Volumn: ${JSON.stringify(accountData.volumnPrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });

  it("Add new slave account 1 to unique  Identity ", async () => {


    let nameId = "Linh.ID";
    let storeIdBalance = "c777d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c777d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volumn";

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
    console.log(`Volumn: ${JSON.stringify(accountData.volumnPrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });


  it("Add new slave account 2 to unique  Identity ", async () => {


    let nameId = "Linh.ID";
    let storeIdBalance = "c666d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c666d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volumn";

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
    console.log(`Volumn: ${JSON.stringify(accountData.volumnPrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });

  it("Update  Identity for slave account 1", async () => {


    let nameId = "Linh.ID";
    let storeIdBalance = "c555d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c555d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volumn";

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
    console.log(`Volumn: ${JSON.stringify(accountData.volumnPrivacy)}`);
    console.log(`Twitter: ${JSON.stringify(accountData.twitterPrivacy)}`);
  });



});
