"use client";
import '@dialectlabs/blinks/index.css';
import { useState, useEffect, useMemo } from 'react';
import { Action, Blink, type ActionAdapter, useActionsRegistryInterval } from "@dialectlabs/blinks";
import { useActionSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import { PublicKey } from '@solana/web3.js';

// needs to be wrapped with <WalletProvider /> and <WalletModalProvider />
const BlinksDisplay = ({ address }: { address: PublicKey | null }) => {
  // SHOULD be the only instance running (since it's launching an interval)
  const { isRegistryLoaded } = useActionsRegistryInterval();
  const { adapter }: { adapter: ActionAdapter} = useActionSolanaWalletAdapter('https://solana-devnet.g.alchemy.com/v2/s_ZQF7EdG2LzQMpDSa70Eo4Zu_Z01sp2');

  const apiUrls = useMemo(() => ([
    // 'https://funding-with-blink.vercel.app/api/vote',
    `https://cross-blink.vercel.app/api/blinks?to=${address}`
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
      <div className="w-full flex items-center justify-center gap-8 mt-4">
        {actions.map(action => (
          <div key={action.url} className="w-1/4">
            <Blink stylePreset="x-dark" action={action} websiteText={new URL(action.url).hostname} />
          </div>
        ))}
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