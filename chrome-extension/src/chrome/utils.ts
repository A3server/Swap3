import { Transaction } from "near-api-js/lib/transaction";
import * as nearAPI from "near-api-js";
import { ConnectConfig, WalletConnection } from "near-api-js";
import BN from 'bn.js';

const CONTRACTDEX = "ref-finance.testnet"
const callOUR = "ft_transfer_call"; // Always the same
const contractName = "dev-1653163201977-81579265596499"

export const getCurrentTabUrl = (callback: (url: string | undefined) => void): void => {
    const queryInfo = {active: true, lastFocusedWindow: true};

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        callback(tabs[0].url);
    });
}

export const getCurrentTabUId = (callback: (url: number | undefined) => void): void => {
    const queryInfo = {active: true, lastFocusedWindow: true};

    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        callback(tabs[0].id);
    });
}

// get prefered token to swap from localstorage tsx format returning a string
const getTokenFromLS = () : string => {
    const token = localStorage.getItem('tokenADDR'); // get token address to use
    if(token === null) {
        return 'banana.ft-fin.testnet';
    }
    return token;
}

function getUrlVars(url: any): any {

    var vars:Map<String,String> = new Map<String,String>();
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m: string,key:string,value:string) {
        // parse the uri from the value
        vars.set(key, value);
    });
    return vars;
}

export async function get_price() {
    const { connect } = nearAPI;
    const config:ConnectConfig = {
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        headers:{}
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
    /*const response = await contract.get_return({
        pool_id: 11,
        token_in: getTokenFromLS(),
        amount_in: "10000",
        token_out: "wrap.testnet",
        min_amount_out: "1"
    });*/
    } catch (e) {
        console.log(e);
    }
}




// scuffed typescript 
export const createNewTransaction = ()  => {
    let newURL = new URL("https://wallet.testnet.near.org/sign?");

    getCurrentTabUrl(url => {
        // url = 'https://wallet.near.org/sign?transactions=CQAAAGVkdXAubmVhcgDw%2FEipmYzmqGhQLkms72qqOh4VzqqZDGyeza42hhpPDsP%2BURrpOwAAFgAAAG1hcmtldHBsYWNlLnBhcmFzLm5lYXJPG0GKn2JRBOydH4jCMJgBlTOp%2FXB3uSIFdz4OmSzjZgEAAAACAwAAAGJ1eXYAAAB7InRva2VuX2lkIjoiNTk3IiwibmZ0X2NvbnRyYWN0X2lkIjoiZ2VuMC5tZXRhZm94b25yeS5uZWFyIiwiZnRfdG9rZW5faWQiOiJuZWFyIiwicHJpY2UiOiIyNTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCJ9AGC3mGyIAAAAAAC5NAMyt%2FStFAAAAAAA&callbackUrl=https%3A%2F%2Fparas.id%2Fmarket'
        const urlvars:string = decodeURIComponent(url ? url : '');
        // console.log("[background.ts] createNewTransaction", urlvars);
        const transaction = getUrlVars(urlvars).get('transactions');
        const callbackURL=  getUrlVars(urlvars).get('callbackUrl');
    
    
        //base 64 hex to transaction serialization
        const transactionDecoded = Transaction.decode(Buffer.from(transaction, 'base64'))
        console.log("[background.ts] createNewTransaction", transactionDecoded);

        // check if we already are in the correct transaction
        if(transactionDecoded.actions[0].functionCall.methodName === callOUR) {
            return;
        }
        console.log(transactionDecoded)
    
        // the transactionDecoded.
        const TxsArgs = transactionDecoded.actions[0].functionCall.args;
        
        
        //parse txsArgs from bytearray to string
        const TxsArgsString = JSON.parse(Buffer.from(TxsArgs).toString())
        // console.log("Public Key:")
        console.log(TxsArgsString)

        let calculatedamount; // bcalculate using view method
        let pool_id; // pre saved in the DEX contract, for now hardcoded depending on the token
        let minimum_amount_near = "1"
        
        const encoded_attch_ammnt = transactionDecoded.actions[0].functionCall.deposit;
        console.log("encoded_attch_ammnt:", encoded_attch_ammnt)

        const old_contract = transactionDecoded.receiverId;
        transactionDecoded.receiverId = getTokenFromLS(); // the same as token_in
        
        const old_method =  transactionDecoded.actions[0].functionCall.methodName;
        transactionDecoded.actions[0].functionCall.methodName = callOUR;

        // decode using bp.js
        // parse encoded_attch_ammnt to bytearray

        // decode from BN object to string
        const decoded_attch_ammnt = new BN(encoded_attch_ammnt).toString();
        console.log("[background.ts] decoded_attch_ammnt", decoded_attch_ammnt);
        
        // console.log(decoded_attch_ammnt);
        const newArgs = {
            "receiver_id": contractName,
            "amount": calculatedamount,
            "msg" : {
                "swap_args": {
                    "actions": [
                        {
                            "pool_id": pool_id, //for the swap
                            "token_in": getTokenFromLS(), // the token that user wants to swap with
                            "amount_in": calculatedamount,
                            "token_out": "wrap.testnet", // usually its near
                            "min_amount_out":  minimum_amount_near// minimum amount of near to swap
                        }
                    ]
                },
                "target_args": {
                    "contract": old_contract, // old contract from the previous transaction
                    "method": old_method,
                    "attached_amount": decoded_attch_ammnt,
                    "args": TxsArgsString
                }
            }
        }
        console.log("newArgs:")
        console.log(newArgs)
        const args_to_send = JSON.stringify(newArgs);
        const ArgsByteArray = Buffer.from(args_to_send)
        transactionDecoded.actions[0].functionCall.args = ArgsByteArray


        // call a view method in the near api



        // create new transaction
        const transactionfinal:Transaction =  new Transaction(transactionDecoded);
        const txsenc = transactionfinal.encode();
        const finalBASE64 = Buffer.from(txsenc).toString('base64');

        // add to newurl the var of the new transaction
        newURL.searchParams.set('transactions', finalBASE64);
        newURL.searchParams.set('callbackUrl', callbackURL);

        
        // check if the url is already the same, if it is not, open the new url
        console.log(newURL.toString())
        chrome.tabs.update({url: newURL.toString()});

    });
}
