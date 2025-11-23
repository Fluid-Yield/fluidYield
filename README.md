# Fluid Yield

Fluid Yield combines on-chain automation with AI-assisted portfolio design so users can curate, deploy, and share multi-step DeFi strategies on Flare in minutes. The stack spans a Next.js dashboard, a typed strategy data model, and a family of modular smart contracts (Strategy registry, ERC-4626 Engine, Flare-native connectors, and an on-chain oracle backed by the Flare Time Series Oracle (FTSO)).

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture--system-design)
3. [Smart Contract Documentation](#smart-contract-documentation)
4. [Flare Network Integration](#flare-network-integration)
5. [Deployment Details](#deployment-details)
6. [Setup & Installation](#setup--installation)
7. [Usage Guide](#usage-guide)
8. [Future Improvements](#future-improvements)
9. [License](#license)

---

## Project Overview

| Category | Details |
| --- | --- |
| **Problem** | Users and liquidity curators struggle to orchestrate multi-step strategies on emerging chains like Flare because each venue (DEX, lending market, wrapped asset bridge) exposes bespoke APIs and pricing sources. |
| **Solution** | Fluid Yield ships an AI-assisted planner plus a modular execution engine. Users prompt for a yield idea, receive a schema-validated plan, and deploy it trustlessly to Flare Coston 2 via our Engine + Strategy contracts. Users can later join/exit those strategies using a single signature. |
| **Vision** | Become the “Zapier for Flare DeFi”: strategy bricks (connectors) that compose swaps, lending, FAsset flows, and oracle-guarded risk checks so communities can launch curated vaults without bespoke Solidity each time. |

Key product pillars:

- **AI co-pilot** – `/api/ai/strategy` calls OpenRouter to synthesize JSON plans constrained to Flare tokens and actions, enforcing schema validation with `strategyFromAiSchema`.@app/api/ai/strategy/route.ts#1-71 @lib/strategy-model.ts#1-37
- **Typed execution Engine** – ERC-4626-powered pooling contract runs strategy steps atomically, updates per-user stats, and emits join/exit events.@contracts/src/engine.sol#1-215
- **Composable connectors** – DEX (SparkDex v2/v3) and lending (Kinetic) adapters implement a shared `IConnector` interface, enabling future modules without touching the Engine.@contracts/src/connectors/dex/SparkDex/v2.sol#1-111 @contracts/src/connectors/lending/Kinetic.sol#1-361
- **Flare-native oracle + assets** – bespoke oracle contract consumes FTSO v2 feeds for FLR, FXRP, BTC, ETH, USDC, and USDT to keep connector math honest.@contracts/src/oracle.sol#1-52

---

## Architecture & System Design

```mermaid
flowchart TD
    subgraph Frontend (Next.js + RainbowKit)
        Prompt[Strategy Prompt UI]
        Create[Create Strategy Wizard]
        Dashboard[Strategy Explorer]
    end

    subgraph Backend (Next App Router)
        API1[/api/ai/strategy\nAI synthesis/]
        API2[/api/strategies/create-from-ai\nmetadata persistence/]
        DB[(Drizzle + SQLite)]
    end

    subgraph Contracts (Flare Coston 2)
        Strategy[(Strategy registry)]
        Engine[(Engine ERC-4626)]
        Oracle[(FTSO Oracle)]
        subgraph Connectors
            SparkDexV2
            SparkDexV3
            Kinetic
        end
    end

    Prompt --> API1 --> DB
    API1 --> Create
    Create -->|deploy| Strategy
    Strategy --> Engine
    Engine -->|executes steps| Connectors
    Connectors --> Oracle
    Engine -->|stats| Strategy
    Dashboard --> DB --> Strategy
```

**Data flow**
1. User prompts the AI endpoint, which enforces Flare-specific constraints
2. Frontend converts the AI JSON into encoded steps using `buildStepsFromAi`, binding each swap hop to SparkDex connectors.
3. `createStrategy` stores validated steps, emits `CreateStrategy`, and whitelists connectors using owner-only controls.
4. Depositors call `Engine.join`, which sources tokens, runs each connector action, updates stats, and emits `Join`. Exits unwind in reverse order and burn shares.
5. Backend services use `getAllStrategiesWithAi` to hydrate dashboards by combining on-chain registry data with AI metadata stored via Drizzle.

---

## Smart Contract Documentation

| Contract | Location | Purpose | Highlights |
| --- | --- | --- | --- |
| **Strategy** | `contracts/src/strategy.sol` | Registry + metadata store for curated strategies. | Validates steps, tracks curator/user stats, toggles connector allowlists, and exposes discovery getters like `getAllStrategies` and `getUserStrategies`.@
| **Engine** | `contracts/src/engine.sol` | ERC-4626 vault that executes strategy steps atomically. | Handles deposits, per-step connector calls, user accounting, and mirrored `exit` unwinds. Includes guardrails on invalid first-step actions and optional share verification hooks.@
| **Oracle** | `contracts/src/oracle.sol` | Thin wrapper around Flare FTSO v2 reference feeds. | Normalizes feed decimals, exposes USD pricing, and provides helper math for connector slippage + borrow decisions.@
| **KineticConnector** | `contracts/src/connectors/lending/Kinetic.sol` | Lending connector targeting Kinetic Markets on Flare. | Supports SUPPLY/BORROW/REPAY/WITHDRAW, price-sensitive borrow sizing via Oracle, and per-user balance tracking. |
| **SparkDexV2/V3 Connectors** | `contracts/src/connectors/dex/SparkDex` | DEX connectors for both router generations. | Provide SWAP + LP supply/withdraw operations with shared base logic (`SparkDexBaseConnector`). |

### Strategy Registry
- **`createStrategy(string name, string description, Step[] steps, uint256 minDeposit)`** – Validates connectors, amount ratios (max 100%), and allowed action types per connector category before persisting and emitting `CreateStrategy`.
- **`updateUserStats/updateStrategyStats/updateUserTokenBalance`** – Called by the Engine/Connectors to append time-series metrics, ensuring the UI can show TVL, unique users, and participation history without extra indexing.
- **`toggleConnector(address)`** – Owner-only guard to add or remove connectors, allowing rapid experimentation during the hackathon without redeploying the Strategy core.

### Engine
- **`join(bytes32 strategyId, address strategyModule, uint256[] amounts)`** – Pulls tokens from the user, dispatches each step to its connector, captures share & underlying balances, and finally logs `Join`.
- **`exit(bytes32 strategyId, address strategyModule)`** – Reverse executes strategy steps, flips connector actions (SUPPLY→WITHDRAW, BORROW→REPAY), and transfers assets back to the user while updating stats.
- Implements ERC-4626 so integrators can represent positions with standard share accounting once fees are introduced.

### Oracle (FTSO Adapter)
- **`getLatestAnswer(bytes21 dataFeed)`** – Fetches price + decimals from Flare’s FTSO v2 contract registry and rescales to 8 decimals for downstream compatibility.
- **`getTokenAPriceInTokenB(...)`** – Utility powering the Kinetic connector’s borrow sizing, ensuring strategies respect collateral ratios even when tokens differ in decimals.

### Connectors
- Common interface `IConnector.execute(ActionType actionType, address[] assetsIn, ...)` ensures the Engine can iterate arbitrary steps.
- **SparkDex Base**: handles approvals, refunding unused liquidity, and writing user balances back into the Strategy contract so later steps can re-use outputs.
- **Kinetic**: integrates with Comptroller + cToken-style contracts, including `enterMarkets`, exchange rate math, and price-based borrow calculations tied to the Oracle.

---

## Flare Network Integration

| Flare Feature | How Fluid Yield Uses It | Benefit |
| --- | --- | --- |
| **FTSO (Time Series Oracle)** | `Oracle.sol` queries `ContractRegistry.getTestFtsoV2()` to pull canonical prices for FLR, SFLR, FXRP, BTC, ETH, USDC, USDT. Connectors consume `getTokenAPriceInTokenB` for swap slippage checks and loan sizing. | Native price resiliency without relying on third-party off-chain services; hackathon-ready because feeds exist on Coston 2. |
| **FAssets** | Target tokens (`FXRP`, wrapped FXRP, and composite flows) align with Flare’s FAsset standard. Strategies can mint/borrow against Kinetic markets that accept wrapped assets collateral; connectors keep track of these share tokens for redemptions. | Unlocks FXRP and other bridged assets in curated strategies, giving builders exposure to Bitcoin/XRPL liquidity from within Flare. |
| **Chain Access + Wallets** | RainbowKit/Wagmi config pins to `flareTestnet` + `flare` with WalletConnect, ensuring UX parity with production once the Engine migrates to mainnet.@app/wagmi.ts#3-16 | Smooth wallet onboarding for judges and hackathon testers. |

**Hackathon learnings**
1. FTSO v2’s contract registry simplifies discovery, but every feed returns decimals that must be normalized before on-chain math. Our oracle wraps that nuance so connectors only see 18-decimal prices.

---

## Deployment Details

| Network | Chain ID | Engine | Strategy | Oracle | KineticConnector | SparkDexV2Connector | SparkDexV3Connector |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Flare Coston 2 | 114 | `0xa5fa69050abe526c99d40ba259e11b627b7cc04f` | `0xea47826461f42166dac7ec63924f583cf14feb13` | `0xfb99509221b07bda22a65a979942faadb0de60bd` | `0xf5c52eb54a61ea7855347bd6d75e64e8fa14ad36` | `0x364bf6f9185653c1baa49e9fe487260d4e082863` | `0xea1d67b8ae5f558056f92f45f4c07ffcd0dab99c` |

**Redeploying**
1. Install Foundry and export `PRIVATE_KEY`, `RPC_URL`, and `ETHERSCAN_API_KEY` (optional verification).
2. Inside `contracts/`, run `forge build` then `forge script script/deploy.s.sol:DeployScript --rpc-url $RPC_URL --broadcast`.
3. Update `lib/contracts/deployed-addresses.json` so the Next.js app automatically points to the latest contracts.

---

## Setup & Installation

### Prerequisites
- Node.js ≥ 20
- Bun (preferred) or npm/yarn
- Foundry (for Solidity toolchain)
- SQLite (bundled) or set `DATABASE_URL` if swapping drivers

### Frontend / Backend
```bash
pnpm install

# copy env template
cp .env.example .env.local

# required vars
OPENROUTER_API_KEY=...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
DATABASE_URL=file:nir.sqlite        # default

# Drizzle migrations (optional)
pnpm db:generate && pnpm db:migrate

# run dev server
pnpm dev
```

### Contracts
```bash
cd contracts
forge install              # already vendored via gitmodules
forge build
forge test
```

---

## Usage Guide

### 1. Create a strategy via the dashboard
1. Open `http://localhost:3000/dashboard/create`.
2. Describe the desired flows (e.g., “swap FXRP → USDC then LP on SparkDex”).
3. Review the AI-generated steps; edit labels if needed.
4. Connect a Flare testnet wallet and deploy. The UI encodes steps via `buildStepsFromAi` and calls `Strategy.createStrategy` followed by Engine interactions.

### 2. Programmatic usage
- **Generate strategies**: POST to `/api/ai/strategy` with `{ "prompt": "..." }`. Response includes schema-validated JSON you can persist or manually encode.
- **Store AI metadata**: POST `/api/strategies/create-from-ai` with `{ strategyId, prompt, strategy }` to log the prompt/response pair for analytics.
- **Read deployed strategies**: call `getAllStrategiesWithAi()` in server actions or scripts to combine on-chain registry data with AI metadata for dashboards.

### 3. Joining / exiting on-chain
- Use Wagmi/Viem `writeContract` against `Strategy.createStrategy` or `Engine.join` directly if you want full control.
- After joining, query `Strategy.getUserStrategyStats` or `getUserTokenBalance` to build custom analytics or redemption flows.

---

## License

Solidity contracts specify `SPDX-License-Identifier: GNU`. Until a repository-wide license file is published, treat the smart-contract components as GNU-licensed and the remainder of the repository as all rights reserved. If you plan to reuse pieces, please reach out so we can finalize a dual-license suited for the Flare ecosystem.
