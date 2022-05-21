use std::collections::HashMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LazyOption, LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::{Base64VecU8, U128};
use near_sdk::serde::{Deserialize, Serialize};
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
        amount: U128,
        msg: String,
        memo: Option<String>,
    ) -> bool;

    fn storage_deposit(&mut self, account_id: Option<ValidAccountId>);
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

        //register on ref finance

        //return the Contract object
        this
    }


    pub fn ft_on_transfer(&mut self, sender_id:AccountId, amount:U128)-> bool{
        let token_address = env::predecessor_account_id();
        env::log(format!("TOKEN ADDR: {}", token_address).as_bytes());
        return false;
    }

    pub fn test(&self) -> Vec<AccountId> {
        return self.supported_tokens.clone();
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
        ).then(ext_self::add_token_resolve(
            token_addr.clone(),
            env::current_account_id(),
            0,
            Gas(5_000_000_000_000)
        ));
        return true;

    }


}