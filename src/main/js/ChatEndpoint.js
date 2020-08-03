export default class ChatEndpoint {
    constructor(serverLocation) {
        this.serverLocation = serverLocation;
    }

    join(user, eventListener) {
        let ws = new WebSocket(`${this.serverLocation}/${user}`)
        ws.addEventListener('open', eventListener)
    }
}

