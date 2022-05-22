import React, { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { ChromeMessage, Sender } from "../types";
import { getCurrentTabUId, getCurrentTabUrl } from "../chrome/utils";
import {Dropdown} from "react-bootstrap";

import mainLogo from "../assets/swap3.svg";
import jumboLogo from "../assets/jumbo.svg";
import tonicLogo from "../assets/tonic.svg";
import refLogo from "../assets/ref.svg";
import VectorBG from "../assets/Vector.svg";
import BarrasMenu from '../assets/BarrasMenu.svg';

import 'bootstrap/dist/css/bootstrap.min.css';

const DEXES = [
    {name: "ref.finance", contract: "ref-finance.testnet", logo: refLogo},
    {name: "jumbo.exchange", contract: "jumbo-exchange.testnet", logo: jumboLogo}
    /*{name: "tonic.foundation", contract: "tonic-foundation.testnet", logo: tonicLogo},*/
]
const TOKENS = [
    "nDAI",
    "BANANAS",
    "USDC",
]
export const Home = () => {
    const [url, setUrl] = useState<string>('');
    const [selectedDEX, setDex] = useState(DEXES[0])

    let {push} = useHistory();

    /**
     * Get current URL
     */
    useEffect(() => {
        getCurrentTabUrl((url) => {
            setUrl(url || 'undefined');
        })
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={mainLogo} className="App-logo" alt="logo" />
                <img src={BarrasMenu} className="App-logo2" style={{marginTop:"5px"}}/>
            </header>
            <p className="MainPage">3 Swap</p>
            <Dropdown>
                <Dropdown.Toggle className="flex-direction-center btn-lg" id="dropdown-basic-button" title="Dropdown button"> 
                    SELECT DEX
                </Dropdown.Toggle>

                <Dropdown.Menu variant="dark" >
                    {
                        DEXES.map((dex) => {
                            return (
                                <Dropdown.Item className = "d-flex flex-row" onClick={() => {
                                    setDex(dex)
                                }}>
                                    <img src={dex.logo} className="logo px-3" alt="logo" />
                                    {dex.name}
                                </Dropdown.Item>
                            )
                        })
                    }
                   
                </Dropdown.Menu>
                </Dropdown>

                <div className="d-flex flex-column justify-content-center ">
                    <span style={{marginTop:"40px"}}>POPULAR TOKENS</span>
                    {/* make a white roudned rectangle */}
                    {
                    TOKENS.map((token) => {
                        return (
                         <div className="rounded-rectangle d-flex flex-row justify-content-start mt-3" style={{marginLeft:"20%"}}>
                         <span  style={{color: "black", marginLeft:"30px", marginTop:"5px"}} >{token}</span>
                     </div>
                     );
                     
                    })}

                    <div className="rounded-rectangle d-flex flex-row justify-content-start mt-3" style={{marginLeft:"20%"}}>
                        <span  style={{color: "black", marginLeft:"30px", marginTop:"5px"}} >Custom Token</span>
                    </div>
                   

                </div>
                <img src={VectorBG} className="VectorBG" alt="logo" />
        </div>
    )
    /*<button onClick={() => {
                    push('/about')
                }}>About page
                </button>*/
}
