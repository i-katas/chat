import chatMessageTranslator from './ChatMessageTranslator'

export default class ChatEndpoint {
    constructor(serverLocation) {
        this.serverLocation = serverLocation;
    }

    join(user, chatMessageListener) {
        let ws = new WebSocket(`${this.serverLocation}/${user}`)
        ws.addEventListener('message', chatMessageTranslator(chatMessageListener))
        return this.waitForReady(ws).then(ws => ({
            send: (message) => {
                return this.waitForReady(ws).then(() => ws.send(message))
            }
        }))
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

