import { AnchorProvider, setProvider, workspace } from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Blink } from "../target/types/blink";
import { Keypair, PublicKey } from "@solana/web3.js";
import { v4 as uuidv4 } from "uuid";
import { assert } from 'chai';
import fs from "fs";

describe("blink", () => {
  setProvider(AnchorProvider.env());

  const program = workspace.Blink as Program<Blink>;
  const programProvider = program.provider as AnchorProvider;

  const masterWallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync("../master-wallet.json", "utf-8"))));

  it("airdrop to master wallet", async () => {
    const signature = await programProvider.connection.requestAirdrop(masterWallet.publicKey, 5_000_000_000);
    const { blockhash, lastValidBlockHeight } = await programProvider.connection.getLatestBlockhash();
    await programProvider.connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    });

    const balance = await programProvider.connection.getBalance(masterWallet.publicKey);

    assert.isAtLeast(balance, 5_000_000_000);
  })

  it("initialize blinkList", async () => {
    const user = Keypair.generate();
    const [blinkListPublicKey] = PublicKey.findProgramAddressSync([Buffer.from("moveon"), user.publicKey.toBuffer()], program.programId);

    const signature = await programProvider.connection.requestAirdrop(user.publicKey, 1_000_000_000);
    const { blockhash, lastValidBlockHeight } = await programProvider.connection.getLatestBlockhash();
    await programProvider.connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    });

    await program.methods.initializeBlinkList().accounts({
      blinkList: blinkListPublicKey,
      user: user.publicKey,
      master: masterWallet.publicKey
    }).signers([masterWallet, user]).rpc();

    const blinkListData = await program.account.blinkList.fetch(blinkListPublicKey);

    assert.deepEqual(blinkListData.isInitialized, true);
    assert.deepEqual(blinkListData.blinks, []);
  });

  it("add a blink to list", async () => {
    const user = Keypair.generate();
    const [blinkListPublicKey] = PublicKey.findProgramAddressSync([Buffer.from("moveon"), user.publicKey.toBuffer()], program.programId);

    const signature = await programProvider.connection.requestAirdrop(user.publicKey, 1_000_000_000);
    const { blockhash, lastValidBlockHeight } = await programProvider.connection.getLatestBlockhash();
    await programProvider.connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    });

    await program.methods.initializeBlinkList().accounts({
      blinkList: blinkListPublicKey,
      user: user.publicKey,
      master: masterWallet.publicKey
    }).signers([masterWallet, user]).rpc();

    const uuid = uuidv4();

    await program.methods.addBlink(
      uuid,
      "name1",
      "description1",
      "image1",
      [
        {
          name: "solana",
          recipientAddress: "8guPL7pGBHx2aFEQfSTsnPjtM7svf8ikeiTQCmUo4ezD",
          acceptedTokens: [
            "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
            "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          ]
        },
        {
          name: "ethereum",
          recipientAddress: "0xa6551B6762673AA07B3Fb48B40579bA6ef51687b",
          acceptedTokens: [
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
          ]
        }
      ]
    ).accounts({
      blinkList: blinkListPublicKey,
      user: user.publicKey,
      master: masterWallet.publicKey
    }).signers([masterWallet, user]).rpc();

    const blinkListData = await program.account.blinkList.fetch(blinkListPublicKey);

    assert.equal(blinkListData.blinks[0].uuid, uuid);
    assert.equal(blinkListData.blinks[0].name, "name1");
    assert.equal(blinkListData.blinks[0].description, "description1");
    assert.equal(blinkListData.blinks[0].image, "image1");

    assert.equal(blinkListData.blinks[0].acceptedChains[0].name, "solana");
    assert.equal(blinkListData.blinks[0].acceptedChains[0].recipientAddress, "8guPL7pGBHx2aFEQfSTsnPjtM7svf8ikeiTQCmUo4ezD");
    assert.includeMembers(blinkListData.blinks[0].acceptedChains[0].acceptedTokens, [
      "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    ]);

    assert.equal(blinkListData.blinks[0].acceptedChains[1].name, "ethereum");
    assert.equal(blinkListData.blinks[0].acceptedChains[1].recipientAddress, "0xa6551B6762673AA07B3Fb48B40579bA6ef51687b");
    assert.includeMembers(blinkListData.blinks[0].acceptedChains[1].acceptedTokens, [
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
    ]);
  });

  it("update a blink to list", async () => {
    const user = Keypair.generate();
    const [blinkListPublicKey] = PublicKey.findProgramAddressSync([Buffer.from("moveon"), user.publicKey.toBuffer()], program.programId);

    const signature = await programProvider.connection.requestAirdrop(user.publicKey, 1_000_000_000);
    const { blockhash, lastValidBlockHeight } = await programProvider.connection.getLatestBlockhash();
    await programProvider.connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    });

    await program.methods.initializeBlinkList().accounts({
      blinkList: blinkListPublicKey,
      user: user.publicKey,
      master: masterWallet.publicKey
    }).signers([masterWallet, user]).rpc();

    const uuid = uuidv4();

    await program.methods.addBlink(
      uuid,
      "name1",
      "description1",
      "image1",
      [
        {
          name: "solana",
          recipientAddress: "8guPL7pGBHx2aFEQfSTsnPjtM7svf8ikeiTQCmUo4ezD",
          acceptedTokens: [
            "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
            "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          ]
        },
        {
          name: "ethereum",
          recipientAddress: "0xa6551B6762673AA07B3Fb48B40579bA6ef51687b",
          acceptedTokens: [
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
          ]
        }
      ]
    ).accounts({
      blinkList: blinkListPublicKey,
      user: user.publicKey,
      master: masterWallet.publicKey
    }).signers([masterWallet, user]).rpc();

    await program.methods.updateBlink(
      uuid,
      "updatedName1",
      "updatedDescription1",
      "updatedImage1",
      [
        {
          name: "solana",
          recipientAddress: "8guPL7pGBHx2aFEQfSTsnPjtM7svf8ikeiTQCmUo4ezD",
          acceptedTokens: [
            "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          ]
        },
        {
          name: "scroll",
          recipientAddress: "0xa6551B6762673AA07B3Fb48B40579bA6ef51687b",
          acceptedTokens: [
            "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
            "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
          ]
        }
      ]
    ).accounts({
      blinkList: blinkListPublicKey,
      user: user.publicKey,
      master: masterWallet.publicKey
    }).signers([masterWallet, user]).rpc();

    const blinkListData = await program.account.blinkList.fetch(blinkListPublicKey);

    assert.equal(blinkListData.blinks[0].uuid, uuid);
    assert.equal(blinkListData.blinks[0].name, "updatedName1");
    assert.equal(blinkListData.blinks[0].description, "updatedDescription1");
    assert.equal(blinkListData.blinks[0].image, "updatedImage1");

    assert.equal(blinkListData.blinks[0].acceptedChains[0].name, "solana");
    assert.equal(blinkListData.blinks[0].acceptedChains[0].recipientAddress, "8guPL7pGBHx2aFEQfSTsnPjtM7svf8ikeiTQCmUo4ezD");
    assert.includeMembers(blinkListData.blinks[0].acceptedChains[0].acceptedTokens, [
      "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    ]);

    assert.equal(blinkListData.blinks[0].acceptedChains[1].name, "scroll");
    assert.equal(blinkListData.blinks[0].acceptedChains[1].recipientAddress, "0xa6551B6762673AA07B3Fb48B40579bA6ef51687b");
    assert.includeMembers(blinkListData.blinks[0].acceptedChains[1].acceptedTokens, [
      "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
      "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
    ]);
  });

  it("delete a blink in list", async () => {
    const user = Keypair.generate();
    const [blinkListPublicKey] = PublicKey.findProgramAddressSync([Buffer.from("moveon"), user.publicKey.toBuffer()], program.programId);

    const signature = await programProvider.connection.requestAirdrop(user.publicKey, 1_000_000_000);
    const { blockhash, lastValidBlockHeight } = await programProvider.connection.getLatestBlockhash();
    await programProvider.connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature
    });

    await program.methods.initializeBlinkList().accounts({
      blinkList: blinkListPublicKey,
      user: user.publicKey,
      master: masterWallet.publicKey
    }).signers([masterWallet, user]).rpc();

    const uuid = uuidv4();

    await program.methods.addBlink(
      uuid,
      "name1",
      "description1",
      "image1",
      [
        {
          name: "solana",
          recipientAddress: "8guPL7pGBHx2aFEQfSTsnPjtM7svf8ikeiTQCmUo4ezD",
          acceptedTokens: [
            "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
            "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          ]
        },
        {
          name: "ethereum",
          recipientAddress: "0xa6551B6762673AA07B3Fb48B40579bA6ef51687b",
          acceptedTokens: [
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "0xdac17f958d2ee523a2206206994597c13d831ec7",
            "0x6c3ea9036406852006290770bedfcaba0e23a0e8"
          ]
        }
      ]
    ).accounts({
      blinkList: blinkListPublicKey,
      user: user.publicKey,
      master: masterWallet.publicKey
    }).signers([masterWallet, user]).rpc();

    await program.methods.deleteBlink(uuid).accounts({
      blinkList: blinkListPublicKey,
      user: user.publicKey,
      master: masterWallet.publicKey
    }).signers([masterWallet, user]).rpc();

    const blinkListData = await program.account.blinkList.fetch(blinkListPublicKey);

    assert.deepEqual(blinkListData.blinks, []);
  });
});
