import { Transaction } from "near-api-js/lib/transaction";

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
    const token = localStorage.getItem('tokenADDR'); // get token address
    if(token === null) {
        return 'usdc.spin-fi.testnet';
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

export const view_prices = (): void => {

}


const callOUR = "ft_transfer_call";

// scuffed typescript 
export const createNewTransaction = ()  => {
    let newURL = new URL("https://wallet.near.org/sign?");

    getCurrentTabUrl(url => {
        const urlvars:string = decodeURIComponent(url ? url : '');
        // console.log("[background.ts] createNewTransaction", urlvars);
        const transaction = getUrlVars(urlvars).get('transactions');
        const callbackURL=  getUrlVars(urlvars).get('callbackUrl');
    
    
        //base 64 hex to transaction serialization
        const transactionDecoded = Transaction.decode(Buffer.from(transaction, 'base64'))

        // check if we already are in the correct transaction
        if(transactionDecoded.actions[0].functionCall.methodName === callOUR) {
            return;
        }
        // console.log(transactionDecoded)
    
        // the transactionDecoded.
        const TxsArgs = transactionDecoded.actions[0].functionCall.args;
        
        
        //parse txsArgs from bytearray to string
        const TxsArgsString = JSON.parse(Buffer.from(TxsArgs).toString())
        // console.log("Public Key:")
        // console.log(TxsArgsString)


    
        // changing the public key and method name for the new transaction
        transactionDecoded.actions[0].functionCall.methodName = callOUR;
        transactionDecoded.receiverId = getTokenFromLS();

        const newArgs = {


        }
        const ArgsASCII = JSON.stringify(newArgs)
        const ArgsByteArray = Buffer.from(ArgsASCII)
        // transactionDecoded.actions[0].functionCall.args = ArgsByteArray


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