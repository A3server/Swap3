import * as nearAPI from "near-api-js";
import {  utils, WalletConnection } from "near-api-js";
const DEXwallets = {
    /*"token_account_id_to_wnear":[pool_id, fee],*/
    'usdc.ft-fin.testnet': [6, 35],
    'nusdc.ft-fin.testnet':[30, 30],
    'banana.ft-fin.testnet':[11, 30],
    'rft.tokenfactory.testnet':[24, 25],
}


const CONTRACTDEX = "ref-finance.testnet"

export async function get_price(attachedAmmountN, contract_data) {
    const { connect } = nearAPI;
    const config = {
        networkId: "testnet",
        keyStore: {},
        nodeUrl: "https://near-testnet--rpc.datahub.figment.io/apikey/363ef686ac2974ee4bc2da2ca7c50f5d",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        headers: {}
      };
    const near = await connect(config);
    const wallet = new WalletConnection(near, null);

    const contract = new nearAPI.Contract(
        wallet.account(), // the account object that is connecting
        CONTRACTDEX,
        {
            // name of contract you're connecting to
            viewMethods: ["get_return"], // view methods do not change state but usually return a value
            changeMethods: [], // change methods modify state
        },
    );

    try {
        const poolid = DEXwallets[contract_data][0];
        const feetopay = DEXwallets[contract_data][1];

        console.log({
            pool_id: poolid,
            token_in: "wrap.testnet",// converted to pay with Wnear always 
            amount_in: attachedAmmountN.toString(),
            token_out: contract_data, // to pay with
            min_amount_out: "1"
        })

        // get the view methods
        const response = await contract.get_return({
            pool_id: poolid,
            token_in: "wrap.testnet",// converted to pay with Wnear always 
            amount_in: attachedAmmountN.toString(),
            token_out: contract_data, // to pay with
            min_amount_out: "1"
        });
        console.log("res:", response)
        const res = {
            price: response,
            pool_id: poolid,
            fee: feetopay  // to get the fee
        }
        return res;
    } catch (e) {
        console.log(e);
    }
}

export const getTokenFromLS = ()  => {
    const token = localStorage.getItem('tokenADDR'); // get token address to use

    //? for testing purposes, the user wants to pay with "banana.ft-fin.testnet"
    return token ?  token : 'banana.ft-fin.testnet';
}


