import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ChromeMessage, Sender } from "../types";
import { getCurrentTabUId, getCurrentTabUrl } from "../chrome/utils";
import mainLogo from "../assets/swap3.svg";
import MenuIcon from "../components/MenuIcon";



export const Home = () => {
    const [url, setUrl] = useState<string>('');
    const [responseFromContent, setResponseFromContent] = useState<string>('');

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
                <img src={mainLogo} className="App-logo" alt="logo"/>
                <MenuIcon />
            </header>
            <p className="MainPage">3 Swap</p>
                <p>URL:</p>
                <p>
                    {url}
                </p>
                <p>Response from content:</p>
                <p>
                    {responseFromContent}
                </p>
                <button onClick={() => {
                    push('/about')
                }}>About page
                </button>
        </div>
    )
}
