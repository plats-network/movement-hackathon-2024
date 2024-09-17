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
  const owner = users[0].publicKey;
  let [identityManagementPDA, _] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('identity_management'),
    ],
    program.programId
  );
  console.log("identityManagementPDA:", identityManagementPDA);
    let [identityPDA, bump] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('identity'), Buffer.from('1')
      ],
      program.programId
    );
    console.log("identityPDA:", identityPDA);
  // it("Is initialized!", async () => {
  //   try {
  //     const txSig = await program.methods
  //       .initialize()
  //       .accounts({
  //         identityManagement: identityManagementPDA,
  //       })
  //       .rpc();
 
  //     console.log(`Transaction Signature: ${txSig}`);
  //   } catch (error) {
  //     // If PDA Account already created, then we expect an error
  //     console.log(error);
  //   }
  // });


  it("Register Identity", async () => {



    let nameId = "Alice.ID";
    let storeIdBalance = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volume";

    let storeIdTwitter = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameTwitter = "secret_twitter";

    const transactionSignature = await program.methods
      .registerIdentity(owner, nameId, [storeIdBalance, storeIdVolume,storeIdTwitter ], [secretNameBalance, secretNameVolume, secretNameTwitter], 0)
    .accounts({
      identityManagement: identityManagementPDA,
      identity: identityPDA
    })
    .rpc();
  });


  // it("Update  Identity", async () => {



  //   let nameId = "Alice.ID";
  //   let storeIdBalance = "c888d3e9-a6c1-438b-a121-295115728f01";
  //   let secretNameBalance = "secret_balance";

  //   let storeIdVolume = "c888d3e9-a6c1-438b-a121-295115728f01";
  //   let secretNameVolume = "secret_volume";

  //   let storeIdTwitter = "c888d3e9-a6c1-438b-a121-295115728f01";
  //   let secretNameTwitter = "secret_twitter";

  //   const transactionSignature = await program.methods
  //     .updateIdentity(nameId, [storeIdBalance, storeIdVolume,storeIdTwitter ], [secretNameBalance, secretNameVolume, secretNameTwitter])
  //   .accounts({
  //     identity: identityPDA
  //   })
  //   .rpc();
  // });


  it("Get Identity", async () => {



    const accountData = await program.account.identityManagement.fetch(identityManagementPDA);

    console.log(`Owner of identity Management: ${accountData.owner}`);
    console.log(`Profiles: ${JSON.stringify(accountData.profiles)}`);
    console.log(`Bumps: ${JSON.stringify(accountData.bump)}`);
  });



});
