import React from 'react';
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
  newChain: string;
  setNewChain: React.Dispatch<React.SetStateAction<string>>;
  newAddress: string;
  setNewAddress: React.Dispatch<React.SetStateAction<string>>;
  addNewChain: (chain: string, address: string) => void;
};

const NewChainModal = ({ isOpen, setIsOpen, newChain, setNewChain, newAddress, setNewAddress, addNewChain }: ModalProps) => {
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
            <p className="text-white mb-3">Select network</p>
            <Select onValueChange={setNewChain}>
              <SelectTrigger className="text-white w-[180px] bg-[#3B2D67] border-opacity-0 font-semibold select-field">
                  <SelectValue placeholder="Target Chain" />
              </SelectTrigger>
              <SelectContent className="bg-[#3B2D67] text-white font-semibold">
                  <SelectItem value="Ethereum">
                    <div className="flex gap-2">
                      <Image src="/ethereum-eth-logo.svg" width={12} height={12} alt="arbitrum" />
                      Ethereum
                    </div>
                  </SelectItem>
                  <SelectItem value="Solana">
                      <div className="flex justify-center items-center gap-2">
                      <SiSolana width={20} height={20} />
                      Solana
                      </div>
                  </SelectItem>
                  <SelectItem value="Aptos">
                    <div className="flex gap-2">
                      <Image src="/aptos-apt-logo.svg" width={20} height={20} alt="aptos" />
                      Aptos
                    </div>
                  </SelectItem>
                  <SelectItem value="Arbitrum">
                    <div className="flex gap-2">
                      <Image src="/arbitrum-arb-logo.svg" width={20} height={20} alt="arbitrum" />
                      Arbitrum
                    </div>
                  </SelectItem>
                  <SelectItem value="Avalanche">
                    <div className="flex gap-2">
                      <Image src="/avalanche-avax-logo.svg" width={20} height={20} alt="avalanche" />
                      Avalanche
                    </div>
                  </SelectItem>
                  <SelectItem value="Base">
                    <div className="flex gap-2">
                      <Image src="/base-logo.png" width={20} height={20} alt="base" />
                      Base
                    </div>
                  </SelectItem>
                  <SelectItem value="Binance">
                    <div className="flex gap-2">
                      <SiBinance />
                      Binance
                    </div>
                  </SelectItem>
                  <SelectItem value="Polygon">
                    <div className="flex gap-2">
                      <Image src="/polygon-matic-logo.svg" width={20} height={20} alt="polygon" />
                      Polygon
                    </div>
                  </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-white mt-8 mb-3">Add address</p>
            <Form {...form}>
              <form>
                <FormField
                  control={form.control}
                  name="blinkName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-[#434871] border-opacity-0 rounded-lg text-white"
                          placeholder="" {...field}
                          value={newAddress}
                          onChange={e => setNewAddress(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <button
            type="button"
            className="bg-[#643cdd] text-white rounded-md font-semibold p-3 mt-10"
            onClick = {() => addNewChain(newChain, newAddress)}>
              Add Network
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NewChainModal;