

/*
const config = {
    networkId: "mainnet",
    keyStore,
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
};
  */

function httpGET(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (this.status == 200) {
                console.log(this.response);
                resolve(this.response);
            }
            else {
                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };
        xhr.onerror = function () {
            reject(new Error("Network Error"));
        };
        xhr.send();
    });
}

$(document).ready(function() {   // Load the function after DOM ready.
    console.log("A3wap is running");
    const nearhttpdefault= "https://wallet.near.org/"
    

    /*const borshSerialize = { kind: 'struct', fields: [
        ['signerId', 'string'],
        ['publicKey', PublicKey],
        ['nonce', 'u64'],
        ['receiverId', 'string'],
        ['blockHash', [32]],
        ['actions', [Action]]
    ]};*/


    
    // grab transactions from the url search params
    var transactionsBytesbase64 = getUrlVars()["transactions"];
    console.log(transactionsBytesbase64)
    //parse transactions bytes in base64 in the curretn TransactionSchema model
    var transactions = Transaction.fromBase64(transactionsBytesbase64);
    // parse transactions string from base64 to string without using atob
    const transactionwierdstruct = window.atob(transactions);
    // transactions is a byte array, convert to string
    console.log(ASCIIfromArray)


    console.log(transactionwierdstruct);

    //! this is scuffed, but it works
    // get the string in between the brakets of ASCII transactions string 
    var args = ASCIItransacitons.substring(ASCIItransacitons.indexOf("{\""), ASCIItransacitons.indexOf("\"}")+2);
    console.log(args);
    //parse args to json
    var json = JSON.parse(args);
    console.log("json args");
    console.log(json);

    // search for ".near" strings in the ASCII transactions string
    var near = ASCIItransacitons.search(".near");
    
    // if .near is found go back until we find a space and save it for users in string array
    if (near > 0) {
        var users = ASCIItransacitons.substring(ASCIItransacitons.lastIndexOf(" ", near), near);
        console.log(users);
    }

    //create transaction object args
    var transaction = ["edup.near", ]
    console.log("transaction object");
    console.log(transaction);

    //parse transaction object to base64
    var transactionbase64 = btoa(JSON.stringify(transaction));



    // create a new url to push a transaction
    const url = nearhttpdefault + "sign?transactions=" + transactionbase64;


    httpGET('https://indexer.ref-finance.net/list-token-price').then(function(response) {
        console.log(response);
    });

    //redirect to the new url
    //window.location.href = url;


});


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        // for every value convert the url to text
        value = decodeURIComponent(value);
        console.log(value)
        
        vars[key] = value;
    });
    return vars;
}