import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import axios from 'axios';
import './App.css';
import * as nearAPI from "near-api-js";
import { Tonic } from '@tonic-foundation/tonic';

import { Buffer } from 'buffer';
import { Transaction } from 'near-api-js/lib/transaction';
import HomePage from './screens/Homepage';
import About from './screens/About';
import Settings from './screens/Settings';

const transaction = "CQAAAGVkdXAubmVhcgDw/EipmYzmqGhQLkms72qqOh4VzqqZDGyeza42hhpPDsL+URrpOwAAFgAAAG1hcmtldHBsYWNlLnBhcmFzLm5lYXLthHDVKMqu1UraTXZTWU82OA2kJfAv6RdLOi39//GDaAEAAAACAwAAAGJ1eXQAAAB7InRva2VuX2lkIjoiMzIyIiwibmZ0X2NvbnRyYWN0X2lkIjoibWludC5oYXZlbmRhby5uZWFyIiwiZnRfdG9rZW5faWQiOiJuZWFyIiwicHJpY2UiOiIxNjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifQBgt5hsiAAAAAAAoIQUQGFRWYQAAAAAAA==";
const CONTRACT_ACCOUNT = 'v1.orderbook.testnet';
const tonic = new Tonic(account, CONTRACT_ACCOUNT);

async function getAllTonicMarkets() {

}


function App() {

  const [prices, setPrices] = React.useState([]);
  const [err, setErr] = React.useState(null);

  React.useEffect(() => {

    // get the url vars
    const urlParams = new URLSearchParams(window.location.search);
    const transactions = urlParams.get('transactions');
    console.log(transactions);


    //base 64 hex to transaction serialization
    const transactionDecoded = Transaction.decode(Buffer.from(transaction, 'base64'))
    console.log(transactionDecoded)

    // the transactionDecoded.
    const TxsArgs = transactionDecoded.actions[0].functionCall.args;
    
    
    //parse txsArgs from bytearray to string
    const TxsArgsString = JSON.parse(Buffer.from(TxsArgs).toString())
    console.log("Public Key:")
    console.log(TxsArgsString)

    const UserpublicKey = TxsArgsString.publicKey;
    const signerId = TxsArgsString.signerId;




    //? FOR main net: make a get request to ref fiance
    /*axios.get('https://indexer.ref-finance.net/list-token-price').then(function (response) {
      console.log(response);
      setPrices(response.data);
    }).catch(function (error) {
      setErr(error);
      console.log(error);
    });*/


    // for tonic testnet
    const account = await near.account(signerId);
    




  }, []);

  return (
    <Router>
      <Routes>
          <Route exact path="/" element={<HomePage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/settings" element={<Settings/>}/>
      </Routes>
    </Router>
  );
}

export default App;
