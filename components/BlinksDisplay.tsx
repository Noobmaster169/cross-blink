"use client";
import '@dialectlabs/blinks/index.css';
import { useState, useEffect, useMemo } from 'react';
import { Action, Blink, type ActionAdapter, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { PublicKey } from '@solana/web3.js';
import dotenv from "dotenv";
import Link from 'next/link';
dotenv.config();

// needs to be wrapped with <WalletProvider /> and <WalletModalProvider />
const BlinksDisplay = ({ address, index }: { address: PublicKey | null, index: number }) => {
  // SHOULD be the only instance running (since it's launching an interval)
  const { isRegistryLoaded } = useActionsRegistryInterval();
  const { adapter }: { adapter: ActionAdapter } = useActionSolanaWalletAdapter('https://solana-devnet.g.alchemy.com/v2/s_ZQF7EdG2LzQMpDSa70Eo4Zu_Z01sp2');

  const apiUrls = useMemo(() => ([ // TODO: append Blink lists based on length of blinkList on-chain
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blinks?to=${address}&index=0`,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blinks?to=${address}&index=1`,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blinks?to=${address}&index=2`,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blinks?to=${address}&index=3`,
  ]), [address]);

  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    const fetchActions = async () => {
      const promises = apiUrls.map(url => Action.fetch(url).catch(() => null));
      const actions = await Promise.all(promises);

      setActions(actions.filter(Boolean) as Action[]);
    }

    fetchActions();
  }, [apiUrls]);

  // we need to update the adapter every time, since it's dependent on wallet and walletModal states
  useEffect(() => {
    actions.forEach((action) => action.setAdapter(adapter));
  }, [actions, adapter]);

  return (
    isRegistryLoaded ? (
      <div className="w-full flex items-center">
        {actions.length ? actions.map(action => (
          <div key={action.url} className="w-96">
            <Blink stylePreset="x-dark" action={action} websiteText={new URL(action.url).hostname} />
          </div>
        )) : (
          <div className="flex flex-col w-full items-center">
            <p className="text-white text-lg">No Blinks Saved</p>
            <Link href="/create">
              <p className="text-white text-lg">Create</p>
            </Link>
          </div>
        )}
      </div>
    ) : null
  )
}

// const ManyActions = ({ adapter }: { adapter: ActionAdapter }) => {
//   const apiUrls = useMemo(() => ([
//     'https://funding-with-blink.vercel.app/api/vote',
//     'https://cross-blink.vercel.app/api/blinks?to=2V4JsTjDnhzYtkSTL1RTqSreRMH5KErwGR6CcC6Ugh9s'
//   ]), []);

//   const [actions, setActions] = useState<Action[]>([]);

//   useEffect(() => {
//     const fetchActions = async () => {
//       const promises = apiUrls.map(url => Action.fetch(url).catch(() => null));
//       const actions = await Promise.all(promises);

//       setActions(actions.filter(Boolean) as Action[]);
//     }

//     fetchActions();
//   }, [apiUrls]);

//   // we need to update the adapter every time, since it's dependent on wallet and walletModal states
//   useEffect(() => {
//     actions.forEach((action) => action.setAdapter(adapter));
//   }, [actions, adapter]);

//   return (
//     <div className="w-1/2">
//       {actions.map(action => (
//         <div key={action.url} className="w-96">
//           <Blink stylePreset="x-dark" action={action} websiteText={new URL(action.url).hostname} />
//         </div>
//       ))}
//     </div>
//   );
// }

export default BlinksDisplay;