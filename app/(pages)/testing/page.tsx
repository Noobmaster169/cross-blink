"use client";

import dynamic from 'next/dynamic'; 
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { clusterApiUrl, Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import React, { useState, useRef, useEffect, useMemo, JSXElementConstructor} from 'react';
import * as anchor from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import NavBar from "@/components/Navbar";
import IDL from "@/anchor/idl.json";
//import { BorshCoder } from '@project-serum/anchor';

export default function Testing(){
    const wallet = useAnchorWallet();
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const programId = new PublicKey("2V4JsTjDnhzYtkSTL1RTqSreRMH5KErwGR6CcC6Ugh9s");



    const callProgram = async () =>{
        if(wallet){
            try{
                const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
                const program =  new anchor.Program<any>(IDL, programId, provider);
                const [fundingPDA, _bump] = findProgramAddressSync([], programId);
                
                //const[blinkPDA, _bump] = findProgramAddressSync([Buffer.from("moveon"), wallet.publicKey.toBuffer()], programId);
                
                console.log("Funding Account is:", fundingPDA.toString());
                console.log("Program:", program);
                //console.log(JSON.stringify(program));

                const tx = await program.methods
                    .fund(new anchor.BN(0.01 * anchor.web3.LAMPORTS_PER_SOL), 1)
                    .accounts({
                        fundingAccount: fundingPDA,
                        authority : wallet.publicKey
                    }).rpc();
            console.log("Transaction:", tx)
            }catch(e){
                console.log(e)
            }
        }
    }

    return(
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





