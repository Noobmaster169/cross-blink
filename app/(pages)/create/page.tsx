"use client"

import NavBar from "@/components/Navbar";
import CreateForm from "@/components/CreateForm";
import { useEffect, useState } from "react";
import BlinkPreview from "@/components/BlinkPreview";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { v4 as uuidv4 } from "uuid";
import idl from "@/anchor/idl.json";
import dotenv from 'dotenv';
import { BLINK_PROGRAM_PUBLIC_KEY, MASTER_WALLET_KEYPAIR } from "@/app/api/blinks/const";
dotenv.config();

export default function Home() {
  const anchorWallet = useAnchorWallet();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [blinkPDA, setBlinkPDA] = useState<PublicKey | null>(null);
  const [blinkTitle, setBlinkTitle] = useState("")
  const [blinkDescription, setBlinkDescription] = useState("")
  const [blinkTokens, setBlinkTokens] = useState([])

  useEffect(() => {
    if (anchorWallet) {
      const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
      setProvider(new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions()));
      setProgram(new Program(idl as Idl, provider));
      setBlinkPDA(PublicKey.findProgramAddressSync([Buffer.from("moveon"), anchorWallet.publicKey.toBuffer()], BLINK_PROGRAM_PUBLIC_KEY)[0]);
    }
  }, [anchorWallet])


  async function addBlink(
    name: string,
    description: string,
    image: string,
    chains: { name: string, recipientAddress: string, acceptedTokens: string[] }[]
  ) {
    if (program && provider && blinkPDA && publicKey) {
      try {
        const tx = await program.methods.addBlink(
          uuidv4(),
          name,
          description,
          image,
          chains
        )
          .accounts({
            blinkList: blinkPDA,
            user: publicKey,
            master: MASTER_WALLET_KEYPAIR.publicKey
          })
          .transaction();

        const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash();

        tx.recentBlockhash = blockhash;
        tx.lastValidBlockHeight = lastValidBlockHeight;
        tx.feePayer = MASTER_WALLET_KEYPAIR.publicKey;
        tx.sign(MASTER_WALLET_KEYPAIR);

        const signature = await sendTransaction(tx, connection);
        await provider.connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
      } catch (error) {
        console.error(error);
      }
    }
  }

  // useEffect(() => {
  //   console.log(blinkTitle, blinkDescription, blinkTokens)
  // }, [blinkTitle, blinkDescription, blinkTokens])

  return (
    <>
      <div className="pb-10">
        <div className="w-screen flex flex-col items-center justify-center h-fit mb-4">
          <NavBar />
          <div className="w-screen flex justify-between px-6 mt-12">
            <div className="w-[40%] ml-20">
              <CreateForm
                blinkTitle={blinkTitle}
                setBlinkTitle={setBlinkTitle}
                blinkDescription={blinkDescription}
                setBlinkDescription={setBlinkDescription}
                blinkTokens={blinkTokens}
                setBlinkTokens={setBlinkTokens}
                addBlink={addBlink}
              />
            </div>
            <div className="w-[40%] mr-20">
              <BlinkPreview
                blinkTitle={blinkTitle}
                blinkDescription={blinkDescription}
                blinkTokens={blinkTokens}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}