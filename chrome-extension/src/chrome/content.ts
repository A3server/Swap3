import { ChromeMessage, Sender } from "../types";
import { createNewTransaction, getCurrentTabUrl } from "./utils";
import { getCurrentTabUId } from "../chrome/utils";

type MessageResponse = (response?: any) => void

const validateSender = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender
) => {
    return sender.id === chrome.runtime.id && message.from === Sender.React;
}

const messagesFromReactAppListener = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    response: MessageResponse
) => {

    const isValidated = validateSender(message, sender);

    if (isValidated && message.message === 'Hello from React') {
        response('Hello from content.js');
        
    }

    if (isValidated && message.message === "delete logo") {
        const logo = document.getElementById('hplogo');
        logo?.parentElement?.removeChild(logo)
    }
}


const sendTestMessage = () => {
    const message: ChromeMessage = {
        from: Sender.React,
        message: "Startedi+",
    }

    getCurrentTabUId((id) => {
        id && chrome.tabs.sendMessage(
            id,
            message,
            (responseFromContentScript) => {
                console.log('[content.ts] responseFromContentScript', responseFromContentScript)
            });
    });
};

  

const main = () => {
    console.log('[content.ts] Main yo')
    console.log('[content.ts] chrome.runtime.id', chrome.runtime.id)

    /**
     * Fired when a message is sent from either an extension process or a content script.
     */
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);


}

main();


