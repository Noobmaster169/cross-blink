"use client"

import Image from "next/image";

type BlinkProps = {
    blinkTitle: string;
    blinkDescription: string;
    blinkTokens: any;
}

const BlinkPreview = ({blinkTitle, blinkDescription, blinkTokens}: BlinkProps) => {
    return(
        <>
            <div className="w-full p-4 px-8 min-h-full bg-[#221a3b] flex flex-col gap-6 text-white rounded-2xl pb-10">
                <div className="items-center justify-center flex">
                    <p className="text-white font-semibold text-2xl">Generated Blinks:</p>
                </div>
                <div className="flex w-full h-full items-center justify-center bg-red-500">
                    <div className="w-full h-full flex items-center justify-center">
                        <Image src="/fumo.jpg" alt="Blink Preview" width={800} height={800} objectFit="contain" />
                    </div>
                </div>
                {/* <div className="items-center flex">
                    <p className="text-white font-semibold text-2xl">{blink.blinkTitle}</p>
                </div>
                <div className="items-center justify-center flex">
                    <p className="text-white font-semibold text-2xl">{blink.blinkTitle}</p>
                </div> */}
                 <div className="items-center flex">
                    <p className="text-white font-semibold text-2xl">{blinkTitle}</p>
                </div>
                <div className="items-center justify-center flex">
                    <p className="text-white font-semibold text-xl">{blinkDescription}</p>
                </div>
                <div className="flex justify-center items-center">
                  {blinkTokens.map((token: any, index: number) => (
                    <div className="pl-4 py-2 mt-2 w-1/2 rounded-full bg-[#3b2d67] flex gap-2 items-center justify-center text-xl font-semibold">
                      {token}
                    </div>
                  ))}
                </div>
            </div>
        </>
    )
}

export default BlinkPreview;