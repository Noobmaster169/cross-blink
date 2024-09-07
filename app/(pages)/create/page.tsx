"use client"

import NavBar from "@/components/Navbar"
import CreateForm from "@/components/CreateForm"
import { useEffect, useState } from "react"
import BlinkPreview from "@/components/BlinkPreview"

export default function Home() {
  const [blinkTitle, setBlinkTitle] = useState("")
  const [blinkDescription, setBlinkDescription] = useState("")
  const [blinkTokens, setBlinkTokens] = useState([])

  useEffect(() => {
    console.log(blinkTitle, blinkDescription, blinkTokens)
  }, [blinkTitle, blinkDescription, blinkTokens])

  return (
    <>
      <div className="pb-10">
        <div className="w-screen flex flex-col items-center justify-center h-fit mb-4">
          <NavBar />
          <div className="w-screen flex justify-between px-6 -mt-12">
            <div className="w-[40%] ml-20">
              <CreateForm
                blinkTitle={blinkTitle}
                setBlinkTitle={setBlinkTitle}
                blinkDescription={blinkDescription}
                setBlinkDescription={setBlinkDescription}
                blinkTokens={blinkTokens}
                setBlinkTokens={setBlinkTokens}
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