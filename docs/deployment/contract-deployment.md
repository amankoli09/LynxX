# Contract Deployment

Step-by-step guide for building and deploying the `fund` and `badge` Soroban contracts to Stellar Testnet.

---

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown

# Install Stellar CLI
cargo install --locked stellar-cli --features opt

# Configure Testnet
stellar network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

---

## Step 1 — Generate a Deployer Keypair

```bash
stellar keys generate --global deployer --network testnet
stellar keys address deployer
# Output: G... (your public key)
```

Fund the deployer account via Friendbot:
```
https://friendbot.stellar.org/?addr=<DEPLOYER_ADDRESS>
```

---

## Step 2 — Build the Contracts

```bash
cd contract
stellar contract build
```

Output:
```
target/wasm32-unknown-unknown/release/fund.wasm
target/wasm32-unknown-unknown/release/badge.wasm
```

Run tests before deploying:
```bash
cargo test
```

---

## Step 3 — Deploy the Badge Contract

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/badge.wasm \
  --source-account deployer \
  --network testnet \
  -- --admin <FUND_CONTRACT_ADDRESS_PLACEHOLDER>
```

> **Note:** The badge contract needs the fund contract's address as `admin`. If you don't know it yet, deploy with a placeholder and update via a re-deploy, or deploy fund first.

Save the output contract ID:
```
BADGE_CONTRACT_ID=C...
```

---

## Step 4 — Deploy the Fund Contract

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/fund.wasm \
  --source-account deployer \
  --network testnet \
  -- \
  --owner <YOUR_OWNER_ADDRESS> \
  --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
  --goal 10000000000
```

Save the output contract ID:
```
FUND_CONTRACT_ID=C...
```

---

## Step 5 — Wire Badge to Fund

```bash
stellar contract invoke \
  --id $FUND_CONTRACT_ID \
  --source-account deployer \
  --network testnet \
  -- set_badge \
  --badge $BADGE_CONTRACT_ID
```

---

## Step 6 — Verify Deployment

```bash
# Read campaign goal
stellar contract invoke \
  --id $FUND_CONTRACT_ID \
  --network testnet \
  -- goal

# Read raised amount
stellar contract invoke \
  --id $FUND_CONTRACT_ID \
  --network testnet \
  -- raised
```

---

## Step 7 — Update Frontend

Update `.env` and Vercel environment variables:
```
REACT_APP_FUND_CONTRACT_ID=<your new fund contract id>
REACT_APP_BADGE_CONTRACT_ID=<your new badge contract id>
```

See [Badge Wiring Setup →](./badge-wiring-setup.md) for the full cross-contract configuration.
