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
  let [identityManagementPDA, bump] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode('identity_management'),
    ],
    program.programId
  );

  it("Is initialized!", async () => {
    try {
      const txSig = await program.methods
        .initialize()
        .accounts({
          identityManagement: identityManagementPDA,
        })
        .rpc();
 
      console.log(`Transaction Signature: ${txSig}`);
    } catch (error) {
      // If PDA Account already created, then we expect an error
      console.log(error);
    }
  });


  it("Register Identity", async () => {



    let nameId = "Alice.ID";
    let storeIdBalance = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameBalance = "secret_balance";

    let storeIdVolume = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameVolume = "secret_volume";

    let storeIdTwitter = "c999d3e9-a6c1-438b-a121-295115728f01";
    let secretNameTwitter = "secret_twitter";

    const transactionSignature = await program.methods
      .registerIdentity(owner, nameId, storeId, secretName, bump)
    .accounts({
      identityManagement: identityManagementPDA,
    })
    .rpc();

    // const accountData = await program.account.ide.fetch(profilePDA);

    // console.log(`Transaction Signature: ${transactionSignature}`);
    // console.log(`Secret Name: ${accountData.info.secretName}`);
    // console.log(`Store Id: ${accountData.info.storeId}`);
    // console.log(`Type Info: ${accountData.info.typeInfo}`);
  });

  // it("Get Profile", async () => {

  //   let [profilePDA, bump] = PublicKey.findProgramAddressSync(
  //     [
  //       anchor.utils.bytes.utf8.encode('profile'),
  //       signer.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );


  //   const accountData = await program.account.profile.fetch(profilePDA);

  //   console.log(`Secret Name: ${accountData.info.secretName}`);
  //   console.log(`Store Id: ${accountData.info.storeId}`);
  //   console.log(`Type Info: ${accountData.info.typeInfo}`);
  // });


});
