import { createSolanaRpc, devnet, address } from "@solana/kit";

// Connect to devnet
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
// defining the address
const targetAddress = address("CAWapuVNZ1pU268rzXUVRVC945mDhpt1HDRMk6ftvcvC");
const token22Address = address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

// Query the balance, 
const {value: balanceInLamports} = await rpc.getBalance(token22Address).send();
const balanceInSol = Number(balanceInLamports) / 1_000_000_000;

console.log(`Address: ${token22Address}`);
console.log(`Balance: ${balanceInSol} SOL`);
