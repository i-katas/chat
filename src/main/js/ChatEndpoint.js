import chatMessageTranslator from './ChatMessageTranslator'

export default class ChatEndpoint {
    constructor(serverLocation) {
        this.serverLocation = serverLocation;
    }

    join(user, eventListener) {
        let ws = new WebSocket(`${this.serverLocation}/${user}`)
        let translator = chatMessageTranslator(eventListener)
        ws.addEventListener('open', translator)
        ws.addEventListener('error', event => {
            translator(event)
        })
        ws.addEventListener('message', translator)
        return this.waitForReady(ws).then(ws => ({
            send: (message) => {
                return this.waitForReady(ws).then(() => ws.send(message))
            }
        }))
    }

    waitForReady(ws) {
        return new Promise(function onComplete(resolve, reject) {
            if (ws.readyState === WebSocket.OPEN) {
                return resolve(ws)
            } else if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
                return reject(ws)
            }
            setTimeout(onComplete, 1, resolve, reject)
        });
    }
}

