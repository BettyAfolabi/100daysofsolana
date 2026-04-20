# Day 1 – Solana Keypair & Balance Check

## Overview

This project demonstrates generating a wallet and checking its balance using @solana/kit on Solana devnet.

## Wallet

* **Address:** `CAWapuVNZ1pU268rzXUVRVC945mDhpt1HDRMk6ftvcvC`
* Funded with **1 SOL** via https://faucet.solana.com/

## Issues Encountered

1. **Missing import**

   * Error when using `address(...)` without importing it
   * Fixed by importing `address` from `@solana/kit`

2. **Undefined address**

   * Passed wallet address without quotes:

     ```js
     address(CAWapuVNZ1pU268rzXUVRVC945mDhpt1HDRMk6ftvcvC)
     ```
   * Fixed by wrapping in quotes:

     ```js
     address("CAWapuVNZ1pU268rzXUVRVC945mDhpt1HDRMk6ftvcvC")
     ```

## Result

Successfully generated a wallet and retrieved its balance from Solana devnet.
