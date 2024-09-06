import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { Styles } from 'react-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SiSolana } from 'react-icons/si';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { SiBinance } from "react-icons/si";
import Image from 'next/image';

type ModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newToken: string;
  setNewToken: React.Dispatch<React.SetStateAction<string>>;
  selectedChain: string;
  setSelectedChain: React.Dispatch<React.SetStateAction<string>>;
  addNewToken: (chain: string, name: string, tokenAddress: string) => void;
  initializedChains: any[];
  blinkTokens: any;
  setBlinkTokens: any;
};

const NewTokenModal = ({ isOpen, setIsOpen, newToken, setNewToken, addNewToken, selectedChain, setSelectedChain, initializedChains, blinkTokens, setBlinkTokens }: ModalProps) => {
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

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      width: "30vw",
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "#221a3b",
      border: "none",
      padding: "0px",
    },
  };

  useEffect(() => {
    console.log(initializedChains)
    
  }, [])


  return (
    <div className="gap-4 flex-col">
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles as Styles}
      >
        <div className="p-5 h-full flex flex-col items-center justify-center gap-3">
          <h1 className="font-semibold p-2 text-center text-white text-3xl">Add New Network</h1>
          <div className="w-full flex-col gap-7 px-8">
            <p className="text-white mb-3">Select Network</p>
            <Select onValueChange={setSelectedChain}>
              <SelectTrigger className="text-white w-[180px] bg-[#3B2D67] border-opacity-0 font-semibold select-field">
                  <SelectValue placeholder="Target Chain" />
              </SelectTrigger>
              <SelectContent className="bg-[#3B2D67] text-white font-semibold">
                  {initializedChains.includes("Ethereum") && (
                    <SelectItem value="Ethereum">
                      <div className="flex gap-2">
                        <Image src="/ethereum-eth-logo.svg" width={12} height={12} alt="arbitrum" />
                        Ethereum
                      </div>
                    </SelectItem>
                  )}
                  {initializedChains.includes("Solana") && (
                    <SelectItem value="Solana">
                      <div className="flex justify-center items-center gap-2">
                        <SiSolana width={20} height={20} />
                        SOL
                      </div>
                    </SelectItem>
                  )}
                  {initializedChains.includes("Aptos") && (
                    <SelectItem value="Aptos">
                      <div className="flex gap-2">
                        <Image src="/aptos-apt-logo.svg" width={20} height={20} alt="aptos" />
                        Aptos
                      </div>
                    </SelectItem>
                  )}
                  {initializedChains.includes("Arbitrum") && (
                    <SelectItem value="Arbitrum">
                      <div className="flex gap-2">
                        <Image src="/arbitrum-arb-logo.svg" width={20} height={20} alt="arbitrum" />
                        Arbitrum
                      </div>
                    </SelectItem>
                  )}
                  {initializedChains.includes("Avalanche") && (
                    <SelectItem value="Avalanche">
                      <div className="flex gap-2">
                        <Image src="/avalanche-avax-logo.svg" width={20} height={20} alt="avalanche" />
                        Avalanche
                      </div>
                    </SelectItem>
                  )}
                  {initializedChains.includes("Base") && (
                    <SelectItem value="Base">
                      <div className="flex gap-2">
                        <Image src="/base-logo.png" width={20} height={20} alt="base" />
                        Base
                      </div>
                    </SelectItem>
                  )}
                  {initializedChains.includes("Binance") && (
                    <SelectItem value="Binance">
                      <div className="flex gap-2">
                        <SiBinance className="mt-1"/>
                        Binance
                      </div>
                    </SelectItem>
                  )}
                  {initializedChains.includes("Polygon") && (
                    <SelectItem value="Polygon">
                      <div className="flex gap-2">
                        <Image src="/polygon-matic-logo.svg" width={20} height={20} alt="polygon" />
                        Polygon
                      </div>
                    </SelectItem>
                  )}
              </SelectContent>
            </Select>
            
            <p className="text-white mb-3 mt-8">Select Token</p>
            <Select onValueChange={setNewToken}>
              <SelectTrigger className="text-white w-[180px] bg-[#3B2D67] border-opacity-0 font-semibold select-field">
                  <SelectValue placeholder="Target Token" />
              </SelectTrigger>
              <SelectContent className="bg-[#3B2D67] text-white font-semibold">
                  <SelectItem value="Ethereum">
                    <div className="flex gap-2">
                      <Image src="/ethereum-eth-logo.svg" width={12} height={12} alt="arbitrum" />
                      Ethereum
                    </div>
                  </SelectItem>
                  <SelectItem value="USDC">
                      <div className="flex justify-center items-center gap-2">
                      <Image src="/usdc.svg" width={20} height={20} alt="aptos" />
                      USDC
                      </div>
                  </SelectItem>
                  <SelectItem value="USDT">
                    <div className="flex gap-2">
                      <Image src="/usdt.svg" width={20} height={20} alt="aptos" />
                      USDT
                    </div>
                  </SelectItem>
                  <SelectItem value="Solana">
                      <div className="flex justify-center items-center gap-2">
                      <SiSolana width={20} height={20} />
                      Solana
                      </div>
                  </SelectItem>
              </SelectContent>
            </Select>

          </div>
          <button
            type="button"
            className="bg-[#643cdd] text-white rounded-md font-semibold p-3 mt-10"
            onClick = {() => {
              setBlinkTokens([...blinkTokens, `${newToken} (${selectedChain})`])
              addNewToken(selectedChain, newToken, "fumoisfun")
            }}>
              Add Token
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NewTokenModal;