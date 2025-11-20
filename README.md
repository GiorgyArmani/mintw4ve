# MINTWAVE 🌊

**Mint your art. Ride your wave.**

MINTWAVE is a decentralized music distribution platform where indie artists upload music, mint it as NFTs, and earn $WAVE tokens through plays. Artists can spend tokens in the marketplace for beats, cover art, video editing, and more.

## Features

- **Upload & Mint**: Upload your tracks and mint them as NFTs on Ethereum
- **Stream2Earn**: Earn $WAVE tokens when people listen to your music
- **Artist Marketplace**: Spend $WAVE on services from other artists
- **Web3 Native**: Built on Ethereum with full wallet integration
- **Royalty Management**: Automated royalty distribution (coming soon)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Web3**: wagmi, viem, ConnectKit (RainbowKit alternative)
- **State**: Zustand with persistence
- **Blockchain**: Ethereum (Sepolia testnet for MVP)
- **Database**: Supabase (optional)
- **Storage**: IPFS via Web3.Storage / Vercel Blob (configurable)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mintwave.git

# Install dependencies
npm install
# or
pnpm install
# or
yarn install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## ⚙️ Configuration

### Web3 Modes

MINTWAVE supports two modes:

1. **Mock Mode** (default): No blockchain required, perfect for development
   \`\`\`env
   NEXT_PUBLIC_WEB3_MODE=mock
   \`\`\`

2. **Onchain Mode**: Real blockchain interactions
   \`\`\`env
   NEXT_PUBLIC_WEB3_MODE=onchain
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   \`\`\`

### Chain Configuration

Default: Sepolia testnet

To switch chains, edit `lib/chain.ts`:

\`\`\`typescript
// For mainnet
import { mainnet } from 'viem/chains'
export const mintwaveChain = mainnet

// For Base L2
import { base } from 'viem/chains'
export const mintwaveChain = base
\`\`\`

### Environment Variables

See `.env.example` for all available configuration options.

## 🎨 Project Structure

\`\`\`
mintwave/
├── app/                    # Next.js app router pages
│   ├── upload/            # Track upload & mint
│   ├── market/            # Artist marketplace
│   ├── dashboard/         # User dashboard
│   ├── tracks/[id]/       # Track detail page
│   └── docs/              # Documentation
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── wave-logo.tsx     # MINTWAVE logo
│   └── gradient-text.tsx # Gradient text component
├── lib/                   # Utilities and configuration
│   ├── chain.ts          # Blockchain configuration
│   ├── contracts.ts      # Contract addresses
│   ├── abi/              # Contract ABIs
│   ├── mock/             # Mock Web3 services
│   ├── storage.ts        # File storage layer
│   └── web3-provider.tsx # Web3 context provider
├── store/                 # Zustand state management
│   ├── wallet.ts         # Wallet state
│   ├── tracks.ts         # Tracks state
│   └── orders.ts         # Orders state
└── supabase/             # Database schema (optional)
\`\`\`

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables:
   - `NEXT_PUBLIC_WEB3_MODE=mock` (or `onchain`)
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (if using onchain mode)
   - Add Supabase/Blob credentials if needed
4. Deploy!

The app will automatically work in mock mode without any blockchain setup.

### Production Checklist

- [ ] Deploy smart contracts (ERC-20 $MINT, ERC-721 Track NFT, Royalty Engine)
- [ ] Update contract addresses in `lib/contracts.ts`
- [ ] Switch to production chain in `lib/chain.ts`
- [ ] Set `NEXT_PUBLIC_WEB3_MODE=onchain`
- [ ] Configure IPFS/Blob storage in `lib/storage.ts`
- [ ] Set up Supabase for production data
- [ ] Add monitoring and analytics

## 📝 Smart Contracts (To Be Deployed)

MINTWAVE requires three smart contracts:

1. **$MINT Token** (ERC-20)
   - Utility token for the platform
   - Earned through streaming, spent in marketplace

2. **Track NFT** (ERC-721)
   - Represents ownership of uploaded tracks
   - Metadata stored on IPFS

3. **Royalty Engine**
   - Handles automated royalty distribution
   - Splits earnings between artists and platform

Contract deployment guide coming soon.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

## 📄 License

MIT License - feel free to use this for your own projects!

## 🔗 Links

- [Website](https://mintwave.app)
- [Documentation](https://mintwave.app/docs)
- [Discord](https://discord.gg/mintwave)
- [Twitter](https://twitter.com/mintwave)

---

Built with ❤️ by the MINTWAVE community
