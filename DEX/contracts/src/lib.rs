use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, U128};
use near_sdk::serde::{Deserialize, Serialize};
use serde_json::Value;
use serde_json;
//import ext_contract

use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, PromiseOrValue, ext_contract, Gas
};
use near_sdk::json_types::ValidAccountId;

#[ext_contract(ext_self)]
pub trait ExtSelf {
    fn add_token_resolve(token_addr:AccountId) ->bool;
}

#[ext_contract(ext_dex_calls)]
pub trait ExtDex {
    fn ft_transfer_call(
        &mut self,
        receiver_id: AccountId,
        amount: String,
        msg: String,
        memo: Option<String>,
    ) -> bool;

    fn storage_deposit(&mut self, account_id: Option<ValidAccountId>);

    fn place_bid(market_id: String, price: String, quantity: String, market_order: bool);
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    //FUTURE: MAKE IT A LOOKUPMAP TO ALLOW MULTIPLE DEXES
    dex_contract: AccountId,
    supported_tokens: Vec<AccountId>,
}

#[near_bindgen]
impl Contract {

    /*
        initialization function (can only be called once).
        this initializes the contract with metadata that was passed in and
        the owner_id. 
    */
    #[init]
    pub fn new(dex:AccountId) -> Self {
        //create a variable of type Self with all the fields initialized.
        let this = Self {
            dex_contract: dex,
            supported_tokens: Vec::new(),
        };

        ext_dex_calls::storage_deposit(
            None,
            this.dex_contract.clone(),
            100_000_000_000_000_000_000_000,
            Gas(3000000000000)
            );

        //register on ref finance

        //return the Contract object
        this
    }
    


    pub fn ft_on_transfer(&mut self, sender_id:AccountId, amount:String, msg:String)-> bool {
        let token_address = env::predecessor_account_id();
        //let v: Value = serde_json::from_str(&msg).ok()?;
        env::log(format!("TOKEN ADDR: {}, PREPAID_GAS {:?}", token_address, env::prepaid_gas()).as_bytes());
        ext_dex_calls::ft_transfer_call(
            self.dex_contract.clone(), 
            amount, 
            "".to_string(), 
            None,
            token_address,
            1,
            Gas(100000000000000)
        );
        // ).and(
        //     ext_dex_calls::place_bid(
        //         v["market_id"].as_str().unwrap().to_string(),
        //         v["price"].as_str().unwrap().to_string(),
        //         amount,
        //         true,
        //         self.dex_contract.clone()
                
        //     )
        // );
        return false;
    }

    pub fn test(&self) -> Option<Vec<AccountId>> {
        let data = "{\"force\":0,\"actions\":[{\"pool_id\":2999,\"token_in\":\"kongztoken.near\",\"token_out\":\"wrap.near\",\"amount_in\":\"57000000000\",\"min_amount_out\":\"724258232698179300000000\"}]}";
        let v: Value = serde_json::from_str(data).ok()?;
        env::log(format!("Please call {} at the number {}", v["force"], v["actions"][0]).as_bytes());
        return Some(self.supported_tokens.clone());
    }

    pub fn add_token_resolve(&mut self, token_addr:AccountId) -> bool{
        self.supported_tokens.push(token_addr);
        true
    }


    #[payable]
    pub fn add_token(&mut self, token_addr: AccountId) -> bool{
        if self.supported_tokens.contains(&token_addr){
            return false;
        }
        ext_dex_calls::storage_deposit(
            None,
            token_addr.clone(),
            env::attached_deposit(),
            Gas(5_000_000_000_000)
        ).and(ext_self::add_token_resolve(
            token_addr.clone(),
            env::current_account_id(),
            0,
            Gas(5_000_000_000_000)
        ));
        return true;

    }

    pub fn reset_tokens(&mut self) -> bool{
        self.supported_tokens.clear();
        return true;
    }


}