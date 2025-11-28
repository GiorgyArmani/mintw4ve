# Wallet Connection Guide

## How to Disconnect Your Wallet

The wallet address in the top right corner is **clickable**. Here's how to disconnect:

1. **Click on the wallet address** (shows as "Ethereum 0x0b...24F2")
2. A modal will appear showing your account details
3. Look for the **"Disconnect"** button at the bottom
4. Click it to disconnect your wallet

## How to Connect a Different Wallet

After disconnecting:

1. Click the **"Connect Wallet"** button
2. Choose your preferred wallet (MetaMask, WalletConnect, etc.)
3. Follow the prompts in your wallet app

## Troubleshooting

If the wallet won't disconnect or you can't connect a different one:

### Clear Browser Cache
1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Click **Local Storage** → your site URL
4. Delete all items
5. Refresh the page

### Manual Disconnect via Console
1. Open browser console (F12)
2. Paste: `localStorage.clear(); window.location.reload()`
3. Press Enter

This will clear all cached wallet connections and reload the page.
