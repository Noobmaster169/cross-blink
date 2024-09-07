import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  Keypair
} from "@solana/web3.js";
import {
  DEFAULT_SOL_ADDRESS,
  DEFAULT_SOL_AMOUNT,
  DEFAULT_RPC,
  DEFAULT_TITLE,
  DEFAULT_AVATAR,
  DEFAULT_DESCRIPTION,
  BLINK_PROGRAM_PUBLIC_KEY,
} from "./const";
import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor';
import idl from "@/anchor/idl.json";

const MOCKUP_DATA = {
  name: "My Cross Blink",
  image: "https://github.com/Noobmaster169/cross-blink/blob/main/public/cross-blink.png?raw=true",
  description: "Send Token to my address using this blink",
  chains: [
    {
      chain: "ethereum",
      address: "0x1234567890",
      acceptedTokens: [{ name: "USDT", tokenAddress: "1234" }, { name: "USDC", tokenAddress: "1234" }],
    },
    {
      chain: "solana",
      address: "Asf249undj",
      acceptedTokens: [{ name: "SOL", tokenAddress: "1234" }, { name: "USDT", tokenAddress: "1234" }, { name: "USDC", tokenAddress: "1234" }],
    },
  ]
}

interface chainProps {
  chain: string;
  address: string;
  acceptedTokens: { name: string, tokenAddress: string }[];
}

interface blinkOptionProps {
  label: string;
  value: string;
}

interface Blink {
  uuid: string;
  name: string;
  description: string;
  image: string;
  acceptedChains: {
    name: string;
    recipientAddress: string;
    acceptedTokens: string[];
  }[];
}

const connection = new Connection(DEFAULT_RPC);

// export const GET = async (req: Request) => {
//   try {
//     const requestUrl = new URL(req.url);
//     const { programId } = validatedQueryParams(requestUrl);

//     let publicKey = programId;
//     publicKey = new PublicKey("4b2iEFTVyMRFWJ3c2JTwEK3q6bmoPWwXxnHG1zXkw6qZ");
//     const blinkProgramId = new PublicKey("CGDCmdCGdL4zCcSgvYkBE6x8PAfih5fzzXt6iFqev5ue");
//     const [blinkPDA] = findProgramAddressSync([Buffer.from("moveon"), publicKey.toBuffer()], blinkProgramId)
//     console.log("Public Key:", publicKey.toString());
//     console.log("Blink PDA:", blinkPDA.toString());

//     const amount = DEFAULT_SOL_AMOUNT;
//     const baseHref = new URL(
//       `/api/blinks?to=${programId.toBase58()}`,
//       requestUrl.origin
//     ).toString();

//     const newWallet: any = {
//       publicKey: null,
//       signTransaction: async (tx: Transaction) => tx,
//       signAllTransactions: async (txs: Transaction[]) => txs,
//     };


//     console.log("Creating Anchor Programs")
//     const connection = new Connection(DEFAULT_RPC);
//     const provider = new AnchorProvider(connection, newWallet, AnchorProvider.defaultOptions());
//     const program = new Program(idl as Idl, provider);
//     console.log("Wallet Connection Successful")

//     const programAccount: any = program.account
//     const blinkList: any = await programAccount.blinkList.fetch(blinkPDA);
//     console.log(blinkList);

//     if (blinkList.blinks) {
//       const blinkData = blinkList.blinks[0];
//       MOCKUP_DATA.name = blinkData.name;
//       MOCKUP_DATA.description = blinkData.description;
//       console.log(blinkData.acceptedChains);
//     }

//     // Get the list of tokens in each chain
//     const tokenOptions: blinkOptionProps[] = [];
//     MOCKUP_DATA.chains.forEach(chain => {
//       chain.acceptedTokens.forEach(token => {
//         const chainName = chain.chain.charAt(0).toUpperCase() + chain.chain.slice(1)
//         const tokenChainLabel = `${chainName}:${token.name}`
//         const tokenChainKey = `${chain.chain}-${token.name}`

//         tokenOptions.push({ label: tokenChainLabel, value: tokenChainKey });
//       })
//     })

//     const payload: ActionGetResponse = {
//       title: MOCKUP_DATA.name,
//       icon:
//         DEFAULT_AVATAR ?? new URL("/solana_devs.jpg", requestUrl.origin).toString(),
//       description: MOCKUP_DATA.description,
//       label: MOCKUP_DATA.name,
//       links: {
//         actions: [
//           {
//             label: "Select Chain",
//             href: `${baseHref}&token={token}&amount={amount}`,
//             parameters: [
//               //{type:"text", name:"message", label:"Transfer Message"},
//               { type: "select", name: "token", label: "Target Chain", options: tokenOptions },
//               // {type:"select", name: "token", label:"Select Token", options: [
//               //     {label: "$SOL", value: "sol"},
//               //     {label: "$ETH", value: "eth"},
//               //     {label: "$USDT", value: "usdt"},
//               //     {label: "$USDC", value: "usdc"},
//               // ]},
//               { type: "text", name: "amount", label: "Transfer Amount" },
//             ]
//           }
//         ],
//       },
//     };

//     return Response.json(payload, {
//       headers: ACTIONS_CORS_HEADERS,
//     });
//   } catch (err) {
//     console.log(err);
//     let message = "An unknown error occurred";
//     if (typeof err == "string") message = err;
//     return new Response(message, {
//       status: 400,
//       headers: ACTIONS_CORS_HEADERS,
//     });
//   }
// };

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { programId: publicKey, index } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/blinks?to=${publicKey.toBase58()}`,
      requestUrl.origin
    ).toString();

    const anchorWallet: any = {
      publicKey: null,
      signTransaction: async (tx: Transaction) => tx,
      signAllTransactions: async (txs: Transaction[]) => txs,
    };

    const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
    const program = new Program(idl as Idl, provider);
    const [blinkPDA] = PublicKey.findProgramAddressSync([Buffer.from("moveon"), publicKey.toBuffer()], BLINK_PROGRAM_PUBLIC_KEY);

    const programAccount: any = program.account
    const blinkList = await programAccount.blinkList.fetch(blinkPDA);

    const blinks: Blink[] = blinkList.blinks;

    const tokenOptions: blinkOptionProps[] = [];

    const { uuid, name, description, image, acceptedChains } = blinks[index];

    acceptedChains.forEach(({ name, recipientAddress, acceptedTokens }) => {
      const chainName = name.charAt(0).toUpperCase() + name.slice(1)

      tokenOptions.push(...acceptedTokens.map(tokenAddress => {
        return { label: tokenAddress, value: tokenAddress }; // TODO: label should be token name
      }))
    })

    const payload: ActionGetResponse = {
      title: name,
      icon: DEFAULT_AVATAR ?? new URL(image, requestUrl.origin).toString(),
      description,
      label: name,
      links: {
        actions: [
          {
            label: "Send Token",
            href: `${baseHref}&token={token}&amount={amount}`,
            parameters: [
              { type: "select", name: "token", label: "Target Chain", options: tokenOptions },
              { type: "text", name: "amount", label: "Transfer Amount" },
            ]
          }
        ],
      }
    }

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

// export const POST = async (req: Request) => {
//   try {
//     const requestUrl = new URL(req.url);
//     const { amount, programId, token } = validatedQueryParams(requestUrl);
//     const body: ActionPostRequest = await req.json();

//     // validate the client provided input
//     let account: PublicKey;
//     try {
//       account = new PublicKey(body.account);
//     } catch (err) {
//       return new Response('Invalid "account" provided', {
//         status: 400,
//         headers: ACTIONS_CORS_HEADERS,
//       });
//     }

//     // ensure the receiving account will be rent exempt
//     const connection = new Connection(DEFAULT_RPC);

//     const minimumBalance = await connection.getMinimumBalanceForRentExemption(
//       0 // note: simple accounts that just store native SOL have `0` bytes of data
//     );
//     if (amount * LAMPORTS_PER_SOL < minimumBalance) {
//       throw `account may not be rent exempt: ${programId.toBase58()}`;
//     }

//     const transaction = new Transaction();
//     transaction.feePayer = account;
//     transaction.add(
//       SystemProgram.transfer({
//         fromPubkey: account,
//         toPubkey: programId,
//         lamports: amount * LAMPORTS_PER_SOL,
//       })
//     );
//     // set the end user as the fee payer
//     transaction.feePayer = account;
//     transaction.recentBlockhash = (
//       await connection.getLatestBlockhash()
//     ).blockhash;

//     const payload: ActionPostResponse = await createPostResponse({
//       fields: {
//         transaction,

//         message: `Send ${amount} SOL to ${programId.toBase58()}`,
//       },
//       // note: no additional signers are needed
//       // signers: [],
//     });

//     return Response.json(payload, {
//       headers: ACTIONS_CORS_HEADERS,
//     });
//   } catch (err) {
//     console.log(err);
//     let message = "An unknown error occurred";
//     if (typeof err == "string") message = err;
//     return new Response(message, {
//       status: 400,
//       headers: ACTIONS_CORS_HEADERS,
//     });
//   }
// };

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { amount, programId: publicKey, token } = validatedQueryParams(requestUrl);
    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0 // note: simple accounts that just store native SOL have `0` bytes of data
    );

    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw `account may not be rent exempt: ${publicKey.toBase58()}`;
    }

    const transaction = new Transaction();
    // transaction.feePayer = account;
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: publicKey, // TODO
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // set the end user as the fee payer
    transaction.feePayer = account;

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SOL to ${publicKey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// function validatedQueryParams(requestUrl: URL) {
//   // Required Parameter for POST: Chain Option, Token Option, Amount
//   let programId: PublicKey;
//   let amount: number = 0;
//   let token: string = "";

//   try {
//     if (requestUrl.searchParams.get("amount")) {
//       amount = parseInt(requestUrl.searchParams.get("amount")!);
//     }
//     if (amount < 0) throw "Invalid Amount";
//   } catch (err) {
//     throw "Invalid input query parameter: amount";
//   }
//   try {
//     if (requestUrl.searchParams.get("token")) {
//       const tokenParam = requestUrl.searchParams.get("token")?.toString();
//       if (tokenParam) {
//         token = tokenParam;
//       }
//     }
//     if (amount < 0) throw "Invalid Amount";
//   } catch (err) {
//     throw "Invalid input query parameter: amount";
//   }

//   try {
//     if (requestUrl.searchParams.get("to")) {
//       programId = new PublicKey(requestUrl.searchParams.get("to")!);
//       if (programId) {
//         console.log("Amount:", amount)
//         console.log("Program ID:", programId.toString());
//         console.log("Token:", token);
//         return { amount, programId, token };
//       }
//     }
//   } catch (err) {
//     throw "Invalid input query parameter: to";
//   }
//   // Throw invalid if data not found:
//   throw "Invalid input query parameter: to";
// }

function validatedQueryParams(requestUrl: URL) {
  // Required Parameter for POST: Chain Option, Token Option, Amount
  let programId: PublicKey;
  let amount: number = 0;
  let token: string = "";
  let index: number = 0;

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseInt(requestUrl.searchParams.get("amount")!);
    }
    if (amount < 0) throw "Invalid Amount";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }
  try {
    if (requestUrl.searchParams.get("token")) {
      const tokenParam = requestUrl.searchParams.get("token")?.toString();
      if (tokenParam) {
        token = tokenParam;
      }
    }
    if (amount < 0) throw "Invalid Amount";
  } catch (err) {
    throw "Invalid input query parameter: amount";
  }

  try {
    if (requestUrl.searchParams.get("to")) {
      programId = new PublicKey(requestUrl.searchParams.get("to")!);
      if (programId) {
        console.log("Amount:", amount)
        console.log("Program ID:", programId.toString());
        console.log("Token:", token);
        return { amount, programId, token, index };
      }
    }
  } catch (err) {
    throw "Invalid input query parameter: to";
  }
  // Throw invalid if data not found:
  throw "Invalid input query parameter: to";
}