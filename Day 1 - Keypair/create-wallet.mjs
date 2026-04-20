import { generateKeyPairSigner, createSolanaRpc, devnet, address} from "@solana/kit";
// Generate a brand new keypair
const wallet = await generateKeyPairSigner();

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"))

console.log("Your new wallet address:", wallet.address);

//const { value: balance } = await rpc.getBalance(wallet.address).send();

const { value: balance } = await rpc.getBalance(address("CAWapuVNZ1pU268rzXUVRVC945mDhpt1HDRMk6ftvcvC")).send();

const balanceInSol = Number(balance) / 1_000_000_000;

console.log("Balance:", `${balanceInSol} SOL`);