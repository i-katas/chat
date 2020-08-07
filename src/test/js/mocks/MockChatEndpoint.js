import ChatEndpoint from "ChatEndpoint";

export default class MockChatEndpoint extends ChatEndpoint {
    users = []
    messages = []
    eventListeners = []
    pos = null

    join(user, eventListener) {
        this.users.push(user)
        this.eventListeners.push(eventListener)
        this.pos = this.eventListeners.length - 1
        return {
            send: (content) => {
                let message = {from: user, content};
                this.messages.push(message)
                return message.promise = new Promise((resolve, reject) => {
                    message.resolve = resolve;
                    message.reject = reject;
                })
            }
        }
    }

    hasReceivedJoinRequestFrom(user) {
        expect(this.users).toContain(user)
    }

    hasReceivedMessageFrom(user, message) {
        expect(this.messages.map(it => ({from: it.from, content: it.content}))).toContainEqual({from: user, content: message})
    }

    ack() {
        let current = this.last();
        if (current != null) {
            this.eventListeners[current].userJoined({})
            this.eventListeners.slice(0, current).forEach(listener => listener.userJoined({from: this.users[current]}))
        }

        let promises = this.messages.map(it => it.promise);
        for (const message of this.messages.splice(0, this.messages.length)) {
            this.send(message)
        }
        return Promise.all(promises)
    }

    fail() {
        let current = this.last();
        if (current != null) {
            this.eventListeners[current].failed()
        }
        let promises = this.messages.map(it => it.promise);
        for (const message of this.messages.splice(0, this.messages.length)) {
            message.reject()
        }
        return Promise.all(promises)
    }

    send(message) {
        this.eventListeners.filter((_, i) => this.users[i] !== message.from).forEach(listener => listener.messageArrived(message));
        message.resolve()
    }

    last() {
        let value = this.pos
        this.pos = null
        return value
    }
}
