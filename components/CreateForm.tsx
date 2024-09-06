"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { z } from "zod"
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
import { SiSolana } from "react-icons/si";

const MOCKUP_DATA = {
    name: "Hello Blinks",
    image: "https://myimage.com",
    description:"Lorem ipsum dolor sit amet bla bla bla",
    chains:[
      {
        chain: "Ethereum",
        address: "0x1234567890",
        acceptedTokens: [{name: "ETH", tokenAddress:"1234"}],
      },
      { 
        chain: "Solana",
        address: "Asf249undj",
        acceptedTokens: [{name: "USDC", tokenAddress:"1234"}],
      },
    {
        chain: "Aptos",
        address: "wow",
        acceptedTokens: [{name: "USDT", tokenAddress:"1234"}],
    },
    ]
  }
 


const CreateForm = () => {
    
    const formSchema = z.object({
      blinkName: z.string(),
      blinkDescription: z.string(),
      walletAddress: z.string(),
      transferAmount: z.number(),
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          blinkName: "",
          blinkDescription: "",
          walletAddress: "",
        },
      })
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return(
        <>
            <div className="w-full p-4 px-8 min-h-full bg-[#221a3b] flex flex-col gap-6 text-white rounded-2xl pb-10">
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
                            <Input className="bg-[#434871] border-opacity-0 rounded-lg" placeholder="" {...field} />
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
                            <Textarea className="bg-[#434871] border-opacity-0 resize-none rounded-lg" placeholder="" {...field} />
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
                                <div className="grid grid-cols-3 w-full gap-y-2 gap-x-4">
                                    {MOCKUP_DATA.chains.map(chain => (
                                        <div className="justify-center py-2 mt-2 w-full rounded-full bg-[#434871] flex gap-2 items-center">
                                            <SiSolana />
                                            {chain.chain}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-3 w-full gap-y-2 gap-x-4">
                                    <Button type="button" className="mt-4 rounded-full bg-[#434871] w-full">+ Add New Chain</Button>
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
                                <div className="grid grid-cols-1 w-1/2 gap-y-2 gap-x-4">
                                    {MOCKUP_DATA.chains.map(chain => (
                                    chain.acceptedTokens.map(token => (
                                        <div className="pl-4 py-2 mt-2 w-full rounded-full bg-[#434871] flex gap-2">
                                            {`${token.name} (${chain.chain})`}
                                        </div>
                                    ))
                                ))}
                                </div>
                                <div className="grid grid-cols-3 w-full gap-y-2 gap-x-4">
                                    <Button type="button" className="mt-4 rounded-full bg-[#434871] w-full">+ Add New Token</Button>
                                </div>
                            </div>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="blinkDescription"
                    render={({ field }) => (
                        <FormItem>
                        <div className="items-center justify-center w-full flex">
                            <Button type="submit" className="rounded-full font-semibold px-16 text-lg bg-[#643cdd]">Create Blinks</Button>
                        </div>
                        </FormItem>
                    )}
                    />
                </form>
                </Form>
                <div>
                </div>
            </div>
        </>
    )
}

export default CreateForm;