import { createSolanaRpc, devnet, createKeyPairSignerFromBytes, generateKeyPairSigner, getBase58Codec, } from "@solana/kit"; 
import { readFile, writeFile } from "node:fs/promises";

const WALLET_FILE = "wallet.json";
const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

async function loadOrCreateWallet() {
    try {
        // read wallet.json, convert it from string to javascript object
        const data = JSON.parse(await readFile(WALLET_FILE, "utf-8"));
        // convert the json back to bytes format
        const secretBytes = new Uint8Array(data.secretKey);
        // recreate the wallet from saved bytes
        const wallet = await createKeyPairSignerFromBytes(secretBytes);
        console.log("Loaded existing wallet:", wallet.address);
        return wallet;
    } catch {
        // No wallet file found, create a new one
        const wallet = await generateKeyPairSigner({ extractable: true });

        // export the private key in pkcs8 format (required because raw export is blocked)
        const pkcs8Buffer = await crypto.subtle.exportKey("pkcs8", wallet.keyPair.privateKey);
        // extract the last 32 bytes from pkcs8 (this represents the actual private key)
        const privateKeyBytes = new Uint8Array(pkcs8Buffer.slice(-32));

        // export the public key in raw byte format
        const publicKeyBytes = new Uint8Array(
            await crypto.subtle.exportKey("raw", wallet.keyPair.publicKey)
        );

        // use the private key and public key to create 64-byte array
        const keypairBytes = new Uint8Array(64);
        keypairBytes.set(privateKeyBytes, 0);
        keypairBytes.set(publicKeyBytes, 32);

        // convert bytes to normal array and then to json. save to wallet.json
        await writeFile(
            WALLET_FILE,
            JSON.stringify({ secretKey: Array.from(keypairBytes) })
        );

        console.log("Created new wallet:", wallet.address);
        console.log(`Saved to ${WALLET_FILE}`);
        return wallet;
    }
}

const wallet = await loadOrCreateWallet();
// call rpc to return the balance of the wallet address in lamports
const { value: balance } = await rpc.getBalance(wallet.address).send();
// convert to SOL
const balanceInSol = Number(balance) / 1_000_000_000;

console.log(`\nAddress: ${wallet.address}`);
console.log(`Balance: ${balanceInSol} SOL`);

if (balanceInSol === 0) {
console.log(
    `\nThis wallet has no SOL. Visit https://faucet.solana.com/ and airdrop some to:`
);
console.log(wallet.address);
}