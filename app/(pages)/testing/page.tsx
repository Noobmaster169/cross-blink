"use client";

import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import React, { useState, useEffect } from 'react';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import NavBar from "@/components/Navbar";
import idl from "@/anchor/idl.json";
import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor';
import { v4 as uuidv4 } from "uuid";

export default function Testing() {
    const anchorWallet = useAnchorWallet();
    const { publicKey, sendTransaction } = useWallet();
    const [provider, setProvider] = useState<AnchorProvider | null>(null);
    const [program, setProgram] = useState<Program | null>(null);
    const [blinkPDA, setBlinkPDA] = useState<PublicKey | null>(null);

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const blinkProgramId = new PublicKey("CGDCmdCGdL4zCcSgvYkBE6x8PAfih5fzzXt6iFqev5ue");

    const masterWallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse("[232,155,14,235,0,140,197,74,209,67,100,75,32,144,85,135,189,14,3,146,199,222,239,112,250,112,216,1,224,172,160,192,3,102,211,47,90,167,50,102,253,164,220,215,162,197,194,99,57,213,53,89,58,207,54,236,4,170,193,162,247,149,66,239]")));

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
                const blinkList = await program.account.blinkList.fetch(blinkPDA);

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





