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

  const owner1 = users[1].publicKey;
  const owner2 = users[2].publicKey;
  console.log("Owner:",owner2);
  const owner3 = users[3].publicKey;
  const owner4 = users[4].publicKey;
  // let [identityManagementPDA, _] = PublicKey.findProgramAddressSync(
  //   [
  //     anchor.utils.bytes.utf8.encode('identity_management'),
  //     owner4.toBuffer()
  //   ],
  //   program.programId
  // );
  // console.log("identityManagementPDA:", identityManagementPDA);
    let [identityPDA, bump] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('identity'),
        owner2.toBuffer()
      ],
      program.programId
    );
    console.log("identityPDA:", identityPDA);



  it("Register Identity", async () => {



    let nameId = "BOB.ID";
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
      owner: owner2
    })
    .rpc();
  });

  it("Get Identity", async () => {



    const accountData = await program.account.identity.fetch(identityPDA);

    console.log(`Name : ${accountData.nameId}`);
    console.log(`Profiles: ${JSON.stringify(accountData.infos)}`);
    console.log(`Owners: ${JSON.stringify(accountData.owner)}`);
  });


  it("Update  Identity", async () => {


    let nameId = "BOB.ID";
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
      owner: owner2
    })
    .rpc();
  });




});
