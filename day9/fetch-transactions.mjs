import { createSolanaRpc, devnet, address } from "@solana/kit"

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

const targetAddress = address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

// copied an address from solana explorer - belongs to a Dr Fraudsworth's Finance factory
const fraudsworthAddress = address("12b3t1cNiAUoYLiWFEnFa4w6qYxVAiqCWU7KZuzLPYtH");

// function to read 5 most recent transaction signature of an address

const signatures = await rpc.getSignaturesForAddress(fraudsworthAddress, { limit: 5 }).send();
console.log(`Last 5 Transactions for ${fraudsworthAddress}`);

for (const tx of signatures) {
    const time = tx.blockTime
        ? new Date(Number(tx.blockTime) * 1000).toLocaleString()
        : "unknown";

    console.log(`Signature: ${tx.signature}`);
    console.log(`Slot: ${tx.slot}`);
    console.log(`Time: ${time}`);
    console.log(`Status: ${tx.err ? "Failed" : "Success"}`);
    console.log("---");
}