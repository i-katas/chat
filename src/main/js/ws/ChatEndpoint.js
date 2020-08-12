import chatMessageTranslator from './ChatMessageTranslator'

const UNUSED_CHAT_LISTENER = () => (0);
const UNUSED_MESSAGE_LISTENER = {
    userJoined(user) {
    },
    messageArrived() {
    }
};
export default class ChatEndpoint {
    constructor(serverLocation) {
        this.serverLocation = serverLocation;
    }

    join(user, chatListener, chatMessageListener) {
        if (typeof chatListener !== 'function') {
            chatMessageListener = chatListener
            chatListener = UNUSED_CHAT_LISTENER
        }
        chatMessageListener = chatMessageListener || UNUSED_MESSAGE_LISTENER
        let ws = new WebSocket(`${this.serverLocation}/${user}`)
        ws.addEventListener('open', () => chatListener(true))
        ws.addEventListener('error', () => chatListener(false))
        ws.addEventListener('close', () => chatListener(false))
        return this.waitForReady(ws).then(ws => this.chatFor(ws, chatMessageListener))
    }

    chatFor(ws, chatMessageListener) {
        ws.addEventListener('message', chatMessageTranslator(chatMessageListener))
        return {
            send: (message) => {
                return this.waitForReady(ws).then(() => ws.send(message))
            }
        }
    }

    waitForReady(ws) {
        return new Promise(function onComplete(resolve, reject) {
            switch (ws.readyState) {
                case WebSocket.OPEN:
                    return resolve(ws)
                case WebSocket.CLOSING:
                case WebSocket.CLOSED:
                    return reject(ws)
            }
            setTimeout(onComplete, 1, resolve, reject)
        });
    }
}

