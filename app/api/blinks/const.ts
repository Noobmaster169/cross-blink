import { PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import dotenv from "dotenv";
dotenv.config();

const DEFAULT_SOL_ADDRESS: PublicKey = new PublicKey(
    process.env.RECIPIENT ?? "H1ZpCkCHJR9HxwLQSGYdCDt7pkqJAuZx5FhLHzWHdiEw"
);

const PROGRAM_ID: PublicKey = new PublicKey("2V4JsTjDnhzYtkSTL1RTqSreRMH5KErwGR6CcC6Ugh9s");

const DEFAULT_SOL_AMOUNT: number = process.env.DEFAULT_AMOUNT ? parseFloat(process.env.DEFAULT_AMOUNT) : 0.01;

const DEFAULT_RPC = process.env.RPC_URL ?? clusterApiUrl("devnet");

const DEFAULT_TITLE = process.env.TITLE ?? "Quadratic Funding with BLINKS";

const DEFAULT_AVATAR = process.env.AVATAR ?? "https://github.com/Noobmaster169/blink-funding-dapp/blob/main/public/solana_devs.png?raw=true";

const DEFAULT_DESCRIPTION = process.env.DESCRIPTION ?? "This Funding Account is funded with donations to two different communities. Try this app to see how to participate in a Quadratic Funding using BLINKS";

const BLINK_PROGRAM_PUBLIC_KEY = new PublicKey("CGDCmdCGdL4zCcSgvYkBE6x8PAfih5fzzXt6iFqev5ue");

const MASTER_WALLET_KEYPAIR = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.NEXT_PUBLIC_MASTER_WALLET)));

export {
    DEFAULT_SOL_ADDRESS,
    PROGRAM_ID,
    DEFAULT_SOL_AMOUNT,
    DEFAULT_RPC,
    DEFAULT_TITLE,
    DEFAULT_AVATAR,
    DEFAULT_DESCRIPTION,
    BLINK_PROGRAM_PUBLIC_KEY,
    MASTER_WALLET_KEYPAIR,
}