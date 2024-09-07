"use client";

import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Keypair } from "@solana/web3.js";
import React, { useState, useEffect } from 'react';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import NavBar from "@/components/Navbar";
import idl from "@/anchor/idl.json";
import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor';
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';
dotenv.config();

export default function Testing() {
    const anchorWallet = useAnchorWallet();
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [provider, setProvider] = useState<AnchorProvider | null>(null);
    const [program, setProgram] = useState<Program | null>(null);
    const [blinkPDA, setBlinkPDA] = useState<PublicKey | null>(null);

    const blinkProgramId = new PublicKey("CGDCmdCGdL4zCcSgvYkBE6x8PAfih5fzzXt6iFqev5ue");

    const masterWallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.NEXT_PUBLIC_MASTER_WALLET ?? "")));

    useEffect(() => {
        if (anchorWallet) {
            const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
            setProvider(new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions()));
            setProgram(new Program(idl as Idl, provider));
            setBlinkPDA(findProgramAddressSync([Buffer.from("moveon"), anchorWallet.publicKey.toBuffer()], blinkProgramId)[0]);
        }
    }, [anchorWallet])

    async function fetchBlinkList(blinkPDA: PublicKey) {
        if (program && provider && publicKey) {
            try {
                const programAccount: any = program.account
                const blinkList = await programAccount.blinkList.fetch(blinkPDA);

                return blinkList;
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function addBlink(
        name: string,
        description: string,
        image: string,
        chains: { name: string, recipientAddress: string, acceptedTokens: string[] }[]
    ) {
        if (program && provider && blinkPDA && publicKey) {
            try {
                console.log({uuidv4(), name, description, image, chains});
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
                        master: masterWallet.publicKey
                    })
                    .transaction();

                const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash();

                tx.recentBlockhash = blockhash;
                tx.lastValidBlockHeight = lastValidBlockHeight;
                tx.feePayer = masterWallet.publicKey;
                tx.sign(masterWallet);

                const signature = await sendTransaction(tx, connection);
                await provider.connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function updateBlink(
        uuid: string,
        name: string,
        description: string,
        image: string,
        chains: { name: string, recipientAddress: string, acceptedTokens: string[] }[]
    ) {
        if (program && provider && blinkPDA && publicKey) {
            try {
                const tx = await program.methods.updateBlink(
                    uuid,
                    name,
                    description,
                    image,
                    chains
                )
                    .accounts({
                        blinkList: blinkPDA,
                        user: publicKey,
                        master: masterWallet.publicKey
                    })
                    .transaction();

                const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash();

                tx.recentBlockhash = blockhash;
                tx.lastValidBlockHeight = lastValidBlockHeight;
                tx.feePayer = masterWallet.publicKey;
                tx.sign(masterWallet);

                const signature = await sendTransaction(tx, provider.connection);
                await provider.connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
            } catch (error) {
                console.error(error);
            }
        }
    }

    async function deleteBlink(uuid: string) {
        if (program && provider && blinkPDA && publicKey) {
            try {
                const tx = await program.methods.deleteBlink(
                    uuid
                )
                    .accounts({
                        blinkList: blinkPDA,
                        user: publicKey,
                        master: masterWallet.publicKey
                    })
                    .transaction();

                const { blockhash, lastValidBlockHeight } = await provider.connection.getLatestBlockhash();

                tx.recentBlockhash = blockhash;
                tx.lastValidBlockHeight = lastValidBlockHeight;
                tx.feePayer = masterWallet.publicKey;
                tx.sign(masterWallet);

                const signature = await sendTransaction(tx, provider.connection);
                await provider.connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight });
            } catch (error) {
                console.error(error);
            }
        }
    }

    const callProgram = async () => {
        if (anchorWallet) {
        }
    }

    return (
        <>
            <div className="pb-10">
                <div className="w-screen flex flex-col items-center justify-center h-2/3">
                    <NavBar />
                    <div className="w-screen flex flex-row justify-between">
                    </div>
                </div>
            </div>
            <div onClick={callProgram}>Hello Motherfucker</div>
        </>)
}





