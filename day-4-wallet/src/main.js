import { createSolanaRpc, devnet } from "@solana/kit";
import { getWallets } from "@wallet-standard/app";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const walletListDiv = document.getElementById("wallet-list");
const connectedDiv = document.getElementById("connected");
const statusDiv = document.getElementById("status");
const errorDiv = document.getElementById("error");

let connectedWallets = [];

// Filter for wallets that support Solana
function isSolanaWallet(wallet) {
  return wallet.chains?.some((chain) => chain.startsWith("solana:"));
}

function renderWalletList(wallets) {
  const solanaWallets = wallets.filter(isSolanaWallet);

  if (solanaWallets.length === 0) {
    walletListDiv.innerHTML = `
      
        No Solana wallets found.<br>
        Install <a href="https://phantom.app" target="_blank">Phantom</a>
        or another Solana wallet to continue.
      `;
    statusDiv.textContent = "";
    return;
  }

  statusDiv.textContent = `Found ${solanaWallets.length} wallet(s):`;
  walletListDiv.innerHTML = "";

  for (const wallet of solanaWallets) {
    const btn = document.createElement("button");
    btn.className = "wallet-btn";
    const icon = wallet.icon;
    btn.innerHTML = icon
      ? ` ${wallet.name}`
      : wallet.name;
    btn.addEventListener("click", () => connectWallet(wallet));
    walletListDiv.appendChild(btn);
  }
}

async function connectWallet(wallet) {
  errorDiv.textContent = "";

  const connectFeature = wallet.features["standard:connect"];
  if (!connectFeature) {
    errorDiv.textContent = "This wallet doesn't support connecting.";
    return;
  }

  try {
    statusDiv.textContent = "Requesting connection...";
    const { accounts } = await connectFeature.connect();

    if (accounts.length === 0) {
      errorDiv.textContent = "No accounts returned.";
      statusDiv.textContent = "";
      return;
    }

    const account = accounts[0];
    const address = account.address;

    const { value: balanceInLamports } = await rpc
      .getBalance(address)
      .send();

    const balanceInSol = (Number(balanceInLamports) / 1_000_000_000).toFixed(9);

    const walletCard = document.createElement("div");
    walletCard.className = "connected";

    walletCard.innerHTML = `
      <h3>${wallet.name}</h3>
      <div class="address">${address}</div>
      <div class="balance">${balanceInSol} SOL</div>
      <button class="disconnect-btn">Disconnect</button>
    `;

    const disconnectBtn = walletCard.querySelector(".disconnect-btn");

    disconnectBtn.addEventListener("click", async () => {
      const disconnectFeature = wallet.features["standard:disconnect"];
      if (disconnectFeature) {
        await disconnectFeature.disconnect();
      }

      // remove from UI
      walletCard.remove();

      // remove from state
      connectedWallets = connectedWallets.filter(
        (w) => w.address !== address
      );
    });

    connectedDiv.appendChild(walletCard);
    connectedDiv.style.display = "block";

    connectedWallets.push({ wallet, address });

    statusDiv.textContent = "";
  } catch (err) {
    errorDiv.textContent = `Connection failed: ${err.message}`;
    statusDiv.textContent = "";
  }
}


// Discover wallets using the Wallet Standard
const { get, on } = getWallets();

// Render any wallets that are already registered
renderWalletList(get());

// Listen for new wallets that register after page load
on("register", () => {
  if (connectedWallets.length === 0) {
    renderWalletList(get());
  }
});