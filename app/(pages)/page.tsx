"use client";

import NavBar from "@/components/Navbar";
import BlinksDisplay from "@/components/BlinksDisplay";
import React from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const { publicKey } = useWallet();
  const searchParams = useSearchParams();

  const index = parseInt(searchParams.get("index") ?? "0");

  return (
    <>
      <div className="pb-10">
        <div className="w-screen flex flex-col items-center justify-center h-full">
          <NavBar />
          <div className="w-screen flex flex-row justify-between">
            <BlinksDisplay address={publicKey} index={index} />
          </div>
        </div>
      </div>
    </>
  );
}