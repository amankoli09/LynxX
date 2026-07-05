# LynxX Factory Contract

This document outlines the architecture and integration of the new `factory` contract, which enables users to dynamically launch their own fundraising campaigns on the LynxX platform directly from the app.

## Problem Solved
Previously, LynxX relied on a single, manually deployed `fund` contract. This severely limited the app, as users could not create custom campaigns on-chain. The new **Factory Contract** acts as an on-chain deployer.

## How It Works

### 1. Initialization
When the `factory` contract is deployed, it is initialized via its `__constructor` with the **WASM hash** of the `fund` contract. The factory securely stores this hash in its persistent storage.

### 2. Campaign Creation
When a user clicks "Launch Campaign" on the frontend, the app sends a transaction to the `factory` contract calling `create_campaign(env, owner, token, goal, deadline)`.
1. **Deterministic Salt:** The factory generates a unique deterministic salt based on an auto-incrementing internal counter.
2. **Dynamic Deployment:** It uses the Soroban SDK's `deploy_v2` function to spin up a completely isolated, brand-new instance of the `fund` contract using the stored WASM hash.
3. **Automatic Initialization:** It immediately passes the `owner`, `token`, `goal`, and `deadline` arguments straight into the new fund's constructor.

### 3. Campaign Registry
The factory maintains a running registry of all deployed campaigns using a `Vec<Address>` in storage. The frontend can query `all_campaigns()` at any time to get a complete, up-to-date list of every active or past campaign on the platform to display to users.

## Testing & CI
To ensure rock-solid stability during cross-contract deployments, the CI pipeline (`.github/workflows/ci.yml`) was updated. 
Before running unit tests, the CI automatically compiles the `fund` contract to `wasm32v1-none`. This compiled WASM is seamlessly injected into the factory unit tests using `include_bytes!`, allowing the test suite to execute the exact same deployment process that the blockchain will run.
