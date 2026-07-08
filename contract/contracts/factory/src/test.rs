#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

// Import the fund contract client to verify deployment
use fund::FundContractClient;

#[test]
fn test_factory_deploy_and_registry() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Upload the fund contract's WASM from the target directory
    // Note: requires `cargo build --target wasm32v1-none --release` to be run first.
    let fund_wasm = include_bytes!("../../../target/wasm32v1-none/release/fund.wasm");
    let wasm_hash = env.deployer().upload_contract_wasm(fund_wasm.as_slice());

    // 2. Deploy the factory
    let factory_id = env.register(FactoryContract, (wasm_hash,));
    let factory = FactoryContractClient::new(&env, &factory_id);

    // Initial state
    assert_eq!(factory.all_campaigns().len(), 0);

    // 3. Create a campaign through the factory
    let owner = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 5000i128;
    let deadline = env.ledger().timestamp() + 1000;

    let milestones = soroban_sdk::vec![&env, 5000i128];
    let campaign_id = factory.create_campaign(&owner, &token, &goal, &deadline, &milestones);

    // 4. Verify factory registry updated
    let campaigns = factory.all_campaigns();
    assert_eq!(campaigns.len(), 1);
    assert_eq!(campaigns.get(0).unwrap(), campaign_id);

    // 5. Verify the deployed contract is actually a FundContract and initialized correctly
    let fund_client = FundContractClient::new(&env, &campaign_id);
    assert_eq!(fund_client.goal(), 5000i128);
    assert_eq!(fund_client.deadline(), deadline);
    assert_eq!(fund_client.owner(), owner);
    assert_eq!(fund_client.token(), token);
}

#[test]
fn test_factory_deploy_multiple_campaigns() {
    let env = Env::default();
    env.mock_all_auths();

    let fund_wasm = include_bytes!("../../../target/wasm32v1-none/release/fund.wasm");
    let wasm_hash = env.deployer().upload_contract_wasm(fund_wasm.as_slice());

    let factory_id = env.register(FactoryContract, (wasm_hash,));
    let factory = FactoryContractClient::new(&env, &factory_id);

    let owner1 = Address::generate(&env);
    let owner2 = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 10_000i128;
    let deadline = env.ledger().timestamp() + 1000;

    let milestones1 = soroban_sdk::vec![&env, goal];
    let campaign1 = factory.create_campaign(&owner1, &token, &goal, &deadline, &milestones1);
    let milestones2 = soroban_sdk::vec![&env, goal * 2];
    let campaign2 = factory.create_campaign(&owner2, &token, &(goal * 2), &deadline, &milestones2);

    // Verify both are tracked
    let campaigns = factory.all_campaigns();
    assert_eq!(campaigns.len(), 2);
    assert_eq!(campaigns.get(0).unwrap(), campaign1);
    assert_eq!(campaigns.get(1).unwrap(), campaign2);

    // Verify isolation
    let fund1 = FundContractClient::new(&env, &campaign1);
    assert_eq!(fund1.owner(), owner1);
    assert_eq!(fund1.goal(), 10_000);

    let fund2 = FundContractClient::new(&env, &campaign2);
    assert_eq!(fund2.owner(), owner2);
    assert_eq!(fund2.goal(), 20_000);
}
