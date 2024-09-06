"use client"

import Image from "next/image";
import { useEffect } from "react";

type BlinkProps = {
    blinkTitle: string;
    blinkDescription: string;
    blinkTokens: any;
}

const tokenImages = [{
  token:"ETH",
  image:"/ethereum-eth-logo.svg"
},
{
  token: "USDC",
  image: "/usdc.svg"
},
{
  token: "USDT",
  image: "/usdt.svg"
},
{
  token: "SOL",
  image: "/solana-sol-logo.svg"
}
]

const BlinkPreview = ({blinkTitle, blinkDescription, blinkTokens}: BlinkProps) => {
  useEffect(() => {
    console.log(blinkTokens)
  }, [blinkTokens])

    return(
        <>
            <div className="w-full p-4 px-8 min-h-fit bg-[#221a3b] flex flex-col gap-6 text-white rounded-2xl pb-10">
                <div className="items-center justify-center flex">
                    <p className="text-white font-semibold text-2xl">Generated Blinks:</p>
                </div>
                <div className="flex w-full h-full items-center justify-center bg-red-500">
                    <div className="w-full h-full flex items-center justify-center">
                        <Image src="/fumo.jpg" alt="Blink Preview" width={800} height={800} objectFit="contain" />
                    </div>
                </div>
                 <div className="items-center flex">
                    <p className="text-white font-semibold text-2xl">{blinkTitle.length > 0 ? blinkTitle : "Blink Title"}</p>
                </div>
                <div className="items-center flex">
                    <p className="text-[#bfbcbc] text-xl">{blinkDescription.length > 0 ? blinkDescription : "Blink description"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full justify-center items-center">
                  {blinkTokens.map((token: any, index: number) => (
                    <div className="pl-4 py-2 mt-2 w-full rounded-full bg-[#3b2d67] flex gap-2 items-center " key={index}>
                      <Image src={`${tokenImages.find(t => t.token === token.split(" ")[0])?.image || "/solana-sol-logo.svg"}`} alt={`${token.name}`} width={16} height={16} />
                      {token}
                    </div>
                  ))}
                </div>
            </div>
        </>
    )
}

export default BlinkPreview;