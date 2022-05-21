import * as nearAPI from "near-api-js";
/*const { keyStores } = nearAPI;
const keyStore = new keyStores.BrowserLocalStorageKeyStore();*/
const { connect } = nearAPI;
let nearconnection;


const config = {
  networkId: "testnet",
  keyStore, 
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};


async function connectNear() {
    nearconnection = await connect(config);
    console.log("Connected to NEAR");
    console.log(nearconnection)
}

connectNear();