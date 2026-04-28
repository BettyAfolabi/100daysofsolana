Another episode on understanding the code.

- So, @wallet-standard/app is what helps detect wallet extension in the browser.
- let connectedWallets = []; - this stores every wallet a user has connected

- the isSolanaWallet function filters the extension found to only wallets that supports solana
- renderWalletList function, renders the filtered wallet as a list and attach a connect button to each wallet.
- the connectWallet function uses the 