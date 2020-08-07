import chatMessageTranslator from './ChatMessageTranslator'

export default class ChatEndpoint {
    constructor(serverLocation) {
        this.serverLocation = serverLocation;
    }

    join(user, eventListener) {
        let ws = new WebSocket(`${this.serverLocation}/${user}`)
        let translator = chatMessageTranslator(eventListener)
        ws.addEventListener('open', translator)
        ws.addEventListener('error', translator)
        ws.addEventListener('message', translator)
        return {
            send: (message) => {
                return this.waitForReady(ws).then(() => ws.send(message))
            }
        }
    }

    waitForReady(ws) {
        return new Promise(function onComplete(resolve) {
            if (ws.readyState === 1) {
                resolve(ws)
                return
            }
            setTimeout(onComplete, 100, resolve)
        });
    }
}

