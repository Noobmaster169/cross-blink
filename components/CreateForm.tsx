"use client"

import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import NewChainModal from "./NewChainModal"
import NewTokenModal from "./NewTokenModal"
import Image from "next/image"

type MockupProps = {
  name: string,
  image: string,
  description: string,
  chains: ChainProps[]
}

type ChainProps = {
  name: string,
  recipientAddress: string,
  acceptedTokens: TokenProps[]
}

type TokenProps = {
  name: string,
  tokenAddress: string
}

const MOCKUP_DATA = {
  name: "Hello Blinks",
  image: "https://myimage.com",
  description: "Lorem ipsum dolor sit amet bla bla bla",
  chains: [
    //       {
    //         chain: "Ethereum",
    //         address: "0x1234567890",
    //         acceptedTokens: [{name: "ETH", tokenAddress:"1234"}],
    //       },
    //       { 
    //         chain: "Solana",
    //         address: "Asf249undj",
    //         acceptedTokens: [{name: "USDC", tokenAddress:"1234"}],
    //       },
    //       {
    //         chain: "Aptos",
    //         address: "wow",
    //         acceptedTokens: [{name: "USDT", tokenAddress:"1234"}],
    //       },
  ] as ChainProps[]
}

type CreateFormProps = {
  blinkTitle: string;
  setBlinkTitle: React.Dispatch<React.SetStateAction<string>>;
  blinkDescription: string;
  setBlinkDescription: React.Dispatch<React.SetStateAction<string>>;
  blinkTokens: any[];
  setBlinkTokens: React.Dispatch<React.SetStateAction<any>>;
  addBlink: (name: string, description: string, image: string, chains: ChainProps[]) => void;
}
const chainImages = [{
  chain: "Ethereum",
  image: "/ethereum-eth-logo.svg"
},
{
  chain: "Solana",
  image: "/solana-sol-logo.svg"
},
{
  chain: "Aptos",
  image: "/aptos-apt-logo.svg"
},
{
  chain: "Arbitrum",
  image: "/arbitrum-arb-logo.svg"
},
{
  chain: "Avalanche",
  image: "/avalanche-avax-logo.svg"
},
{
  chain: "Base",
  image: "/base-logo.png"
},
{
  chain: "Binance",
  image: "/binance.svg"
},
{
  chain: "Polygon",
  image: "/polygon-matic-logo.svg"
}
]

const tokenImages = [
  {
    token: "ETH",
    image: "/ethereum-eth-logo.svg"
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

const CreateForm = ({ blinkTitle, setBlinkTitle, blinkDescription, setBlinkDescription, blinkTokens, setBlinkTokens, addBlink }: CreateFormProps) => {
  function addNewChain(name: string, recipientAddress: string) {
    MOCKUP_DATA.chains.push({
      name,
      recipientAddress,
      acceptedTokens: [],
    });
    console.log(MOCKUP_DATA.chains)
    setIsChainModalOpen(false);
  };

  const addNewToken = (chain: string, name: string, tokenAddress: string) => {
    const chainIndex = MOCKUP_DATA.chains.findIndex((c) => c.name === chain);
    MOCKUP_DATA.chains[chainIndex].acceptedTokens.push({ name, tokenAddress });
    console.log(MOCKUP_DATA.chains);
    setSelectedChain("");
    setNewToken("");
    setIsTokenModalOpen(false);
  };

  const formSchema = z.object({
    blinkName: z.string(),
    blinkDescription: z.string(),
    walletAddress: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blinkName: "",
      blinkDescription: "",
      walletAddress: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const defaultImage = "https://github.com/Noobmaster169/cross-blink/blob/main/public/cross-blink.png?raw=true"

    // console.log(values)
    console.log("got here")
    await addBlink(values.blinkName, values.blinkDescription, defaultImage, MOCKUP_DATA.chains); // TODO: pass arguments to addBlink
  }

  const [isChainModalOpen, setIsChainModalOpen] = useState(false);
  const [newChain, setNewChain] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [initializedChains, setInitializedChains] = useState(MOCKUP_DATA.chains.map(chain => chain.name));

  useEffect(() => {
    setBlinkTokens(MOCKUP_DATA.chains.map(chain => chain.acceptedTokens.map(token => `${token.name} (${chain.name})`)).flat())
  }, [])

  return (
    <>
      <NewChainModal
        addNewChain={addNewChain}
        isOpen={isChainModalOpen}
        setIsOpen={setIsChainModalOpen}
        newChain={newChain}
        setNewChain={setNewChain}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        initializedChains={initializedChains}
        setInitializedChains={setInitializedChains}
      />
      <NewTokenModal
        isOpen={isTokenModalOpen}
        setIsOpen={setIsTokenModalOpen}
        newToken={newToken}
        setNewToken={setNewToken}
        addNewToken={addNewToken}
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
        initializedChains={initializedChains}
        blinkTokens={blinkTokens}
        setBlinkTokens={setBlinkTokens}
      />
      <div className="w-full p-4 px-8 min-h-fit bg-[#221a3b] flex flex-col gap-6 text-white rounded-2xl pb-10">
        <div className="items-center justify-center flex">
          <p className="text-white font-semibold text-2xl">Create your Cross-Chain Blinks</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-[#221a3b] space-y-8 h-full">
            <FormField
              control={form.control}
              name="blinkName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blink Name:</FormLabel>
                  <FormControl>
                    <Input
                        {...field}
                        className="bg-[#434871] border-opacity-0 rounded-lg"
                        placeholder=""
                        // value={blinkTitle}
                        onChange={(e) => {
                            field.onChange(e);
                            setBlinkTitle(e.target.value)
                        }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blinkDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blink Description:</FormLabel>
                  <FormControl>
                    <Textarea
                        {...field}
                        className="bg-[#434871] border-opacity-0 resize-none rounded-lg"
                        placeholder=""
                        onChange={(e) => {
                            field.onChange(e);
                            setBlinkDescription(e.target.value);
                        }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blinkDescription"
              render={({ field }) => (
                <FormItem className="h-1/4">
                  <div className="flex-col gap-6 h-full">
                    <p className="font-semibold">Accepted Chains:</p>
                    <div className="grid grid-cols-2 w-full gap-y-2 gap-x-4">
                      {MOCKUP_DATA.chains.slice(0, 4).map((chain, index) => (
                        <div className="justify-center py-2 mt-2 w-full rounded-full bg-[#3b2d67] flex gap-2 items-center" key={index}>
                          <Image src={`${chainImages.find(c => c.chain === chain.name)?.image}`} alt={`${chain.name}`} width={14} height={14} />
                          {chain.name}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 w-full gap-y-2 gap-x-4">
                      {MOCKUP_DATA.chains.length < 4 &&
                        <Button
                          type="button"
                          className="mt-8 rounded-full bg-[#434871] w-full px-4"
                          onClick={() => setIsChainModalOpen(true)}
                        >
                          + Add New Chain
                        </Button>}
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blinkDescription"
              render={({ field }) => (
                <FormItem className="h-1/3">
                  <div className="flex-col gap-6 h-full">
                    <p className="font-semibold">Accepted Tokens:</p>
                    <div className="grid grid-cols-2 w-full gap-y-2 gap-x-4">
                      {MOCKUP_DATA.chains.slice(0, 4).map((chain, index1) => (
                        chain.acceptedTokens.map((token, index2) => (
                          <div className="pl-4 py-2 mt-2 w-full rounded-full bg-[#3b2d67] flex gap-2" key={`${index1}-${index2}`}>
                            <Image src={`${tokenImages.find(t => t.token === token.name)?.image}`} alt={`${token.name}`} width={16} height={16} />
                            <p>{`${token.name} (${chain.name})`}</p>
                          </div>
                        ))
                      ))}
                    </div>
                    <div className="grid grid-cols-3 w-full gap-y-2 gap-x-4">
                      <Button type="button"
                        className="mt-8 rounded-full bg-[#434871] w-full"
                        onClick={() => setIsTokenModalOpen(true)}
                      >
                        + Add New Token
                      </Button>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <div className="items-center justify-center w-full flex">
                <Button type="submit" className="rounded-full font-semibold px-16 w-1/2 text-lg bg-[#643cdd]">Create Blinks</Button>
            </div>
          </form>
        </Form>
        <div>
        </div>
      </div>
    </>
  )
}

export default CreateForm;