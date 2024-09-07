"use client";

import NavBar from "@/components/Navbar";
import BlinksDisplay from "@/components/BlinksDisplay";
import React from 'react';

export default function Home() {
  return (
    <>
      <div className="pb-10">
        <div className="w-screen flex flex-col items-center justify-center h-full">
          <NavBar />
          <div className="w-screen flex flex-row justify-between">
            <BlinksDisplay />
          </div>
        </div>
      </div>
    </>
  );
}