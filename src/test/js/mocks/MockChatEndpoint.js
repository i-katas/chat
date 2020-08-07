import ChatEndpoint from "ChatEndpoint";

export default class MockChatEndpoint extends ChatEndpoint {
    users = []
    messages = []
    eventListeners = []

    join(user, eventListener) {
        this.users.push(user)
        this.eventListeners.push(eventListener)
        return {
            send: (message) => {
                this.messages.push({from: user, content: message})
                this.eventListeners.filter((_, i) => this.users[i] !== user).forEach(listener =>
                    listener.messageArrived({from: user, content: message}));
            }
        }
    }

    hasReceivedJoinRequestFrom(user) {
        expect(this.users).toContain(user)
    }

    hasSentMessageFrom(user, message) {
        expect(this.messages).toContainEqual({from: user, content: message})
    }

    ack() {
        let current = this.last();
        this.eventListeners[current].userJoined({})
        this.eventListeners.slice(0, current).forEach(listener => listener.userJoined({from: this.users[current]}))
    }

    fail() {
        this.eventListeners[this.last()].failed()
    }

    last() {
        return this.eventListeners.length - 1
    }
}
