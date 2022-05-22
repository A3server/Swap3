use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, U128};
use near_sdk::serde::{Deserialize, Serialize};
use serde_json::Value;
use serde_json::json;
//import ext_contract

use near_sdk::{
    env, near_bindgen, AccountId, Balance, CryptoHash, PanicOnDefault, Promise, PromiseOrValue, PromiseResult,ext_contract, Gas
};
use near_sdk::json_types::ValidAccountId;

#[ext_contract(ext_self)]
pub trait ExtSelf {
    fn add_token_resolve(token_addr:AccountId) ->bool;
    fn swap_resolve(&mut self, v:Value);
    fn deposit_resolve(&mut self, v:Value);

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

    fn place_bid(&mut self, market_id: String, price: String, quantity: String, market_order: bool);
    
    

    fn withdraw(&mut self, token_id:AccountId, amount:String);
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
    


    pub fn ft_on_transfer(&mut self, sender_id:AccountId, amount:String, msg:String)-> String {
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
            Gas(10000000000000)
        );
        // .then(
        //     ext_self::deposit_resolve(
        //         v,
        //         env::current_account_id(),
        //         0,
        //         Gas(10000000000000)
        //     )
        // );
        
        // ).and(
        //     ext_dex_calls::place_bid(
        //         v["market_id"].as_str().unwrap().to_string(),
        //         v["price"].as_str().unwrap().to_string(),
        //         amount,
        //         true,
        //         self.dex_contract.clone()
                
        //     )
        // );
        return "ola".to_string();
    }

    #[private]
    pub fn deposit_resolve(&mut self, v:Value){
        assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");
        match env::promise_result(0) {
        PromiseResult::NotReady => unreachable!(),
        PromiseResult::Successful(val) => {
            if let Ok(amount) = near_sdk::serde_json::from_slice::<String>(&val) {
                
                Promise::new(self.dex_contract.clone()).function_call(
                    "swap".to_string(),
                    json!(v["swap_args"]).to_string().as_bytes().to_vec(),
                    1,
                    Gas(10000000000000)
                ).then(
                    ext_self::swap_resolve(
                        v,
                        env::current_account_id(),
                        0,
                        Gas(50000000000000)
                    )
                );

            } else {
                env::panic(b"ERR_WRONG_VAL_RECEIVED")
            }
        },
        PromiseResult::Failed => env::panic(b"ERR_CALL_FAILED"),
        }
    }

    #[private]
    pub fn swap_resolve(&mut self, v:Value) {
        assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");
        match env::promise_result(0) {
        PromiseResult::NotReady => unreachable!(),
        PromiseResult::Successful(val) => {
            if let Ok(amount) = near_sdk::serde_json::from_slice::<String>(&val) {
                //env::log(format!("SWAP_RESOLVE: {}", token_out).as_bytes());
                ext_dex_calls::withdraw(
                    v["swap_args"]["actions"][0]["token_out"].to_string().trim_matches('"').to_string().try_into().unwrap(),
                    amount,
                    self.dex_contract.clone(),
                    1,
                    Gas(20000000000000)
                ).then(
                Promise::new(v["target_args"]["contract"].to_string().trim_matches('"').to_string().try_into().unwrap()).function_call(
                    v["target_args"]["method"].to_string().trim_matches('"').to_string(),
                    json!(v["target_args"]["args"]).to_string().as_bytes().to_vec(),
                    v["target_args"]["attached_amount"].to_string().trim_matches('"').parse::<u128>().unwrap(),
                    Gas(60000000000000)
                ));


            } else {
                env::panic(b"ERR_WRONG_VAL_RECEIVED")
            }
        },
        PromiseResult::Failed => env::panic(b"ERR_CALL_FAILED"),
    }
    }

    pub fn test(&self) -> AccountId {
        return self.dex_contract.clone();
    }


    #[payable]
    pub fn add_token(&mut self, token_addr: AccountId) -> bool{
        ext_dex_calls::storage_deposit(
            None,
            token_addr.clone(),
            env::attached_deposit(),
            Gas(5_000_000_000_000)
        );
        return true;

    }

    pub fn reset_tokens(&mut self) -> bool{
        self.supported_tokens.clear();
        return true;
    }


}