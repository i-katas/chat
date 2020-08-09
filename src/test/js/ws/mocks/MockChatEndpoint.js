import ChatEndpoint from "ws/ChatEndpoint";

export default class MockChatEndpoint extends ChatEndpoint {
    tasks = []
    users = []
    messages = []
    eventListeners = []

    join(user, eventListener) {
        this.users.push(user)
        this.eventListeners.push(eventListener)
        let current = this.eventListeners.length - 1

        return this.start(resolve => {
            eventListener.userJoined({})
            this.eventListeners.slice(0, current).forEach(listener => listener.userJoined({from: user}))
            resolve({
                send: (content) => {
                    let message = {from: user, content};
                    this.messages.push(message)
                    return this.start(resolve => {
                        this.eventListeners.filter(it => it !== eventListener).forEach(it => it.messageArrived(message))
                        resolve(message)
                    })
                }
            })
        })
    }

    start(resolveWith) {
        let task = new Promise((resolve, reject) => {
            this.tasks.push({
                reject() {
                    reject()
                    return task
                },
                resolve() {
                    resolveWith(resolve)
                    return task
                }
            })
        });
        return task
    }

    hasReceivedJoinRequestFrom(user) {
        expect(this.users).toContain(user)
    }

    hasReceivedMessageFrom(user, message) {
        expect(this.messages.map(it => ({from: it.from, content: it.content}))).toContainEqual({from: user, content: message})
    }

    ack() {
        return this.run(it => it.resolve())
    }

    fail() {
        return this.run(it => it.reject())
    }

    run(handler) {
        return Promise.all(this.tasks.splice(0).map(handler));
    }

    send(message) {
        this.eventListeners.filter((_, i) => this.users[i] !== message.from).forEach(listener => listener.messageArrived(message));
        message.resolve()
    }
}
