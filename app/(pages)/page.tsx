"use client";

import NavBar from "@/components/Navbar";
import BlinksDisplay from "@/components/BlinksDisplay";
import React from 'react';
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <>
      <div className="pb-10">
        <div className="w-screen flex flex-col items-center justify-center h-full">
          <NavBar />
          <div className="w-screen flex justify-center items-center">
            <BlinksDisplay address={publicKey} />
          </div>
        </div>
      </div>
    </>
  );
}