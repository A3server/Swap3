import * as nearAPI from "near-api-js";
import {  WalletConnection } from "near-api-js";
const DEXwallets = {
    "BANANA": "banana.ft-fin.testnet",
    "nUSDC": "nusdc.ft-fin.testnet",
    "nUSDT": "nusdt.ft-fin.testnet",
    "nDAI": "ndai.ft-fin.testnet",
}
const CONTRACTDEX = "ref-finance.testnet"

export async function get_price() {
    const { connect } = nearAPI;
    config = {
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
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
        // get the view methods
        const response = await contract.get_return({
            pool_id: 11,
            token_in: getTokenFromLS(),
            amount_in: "10000",
            token_out: "wrap.testnet",
            min_amount_out: "1"
        });
    console.log(response);
    return response;
    } catch (e) {
        console.log(e);
    }
}

export const getTokenFromLS = ()  => {
    const token = localStorage.getItem('tokenADDR'); // get token address to use
    if(token === null) {
        return 'banana.ft-fin.testnet';
    }
    return token;
}
