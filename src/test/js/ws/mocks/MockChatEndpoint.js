import ChatEndpoint from "ws/ChatEndpoint";

export default class MockChatEndpoint extends ChatEndpoint {
    tasks = []
    users = []
    messages = []
    eventListeners = []

    join(user, chatListener, chatMessageListener) {
        this.users.push(user)
        this.eventListeners.push(chatMessageListener)
        let current = this.eventListeners.length - 1

        let rejection = reject => (chatListener(false), reject());
        return this.start(resolve => {
            chatListener(true)
            this.eventListeners.slice(0, current).forEach(listener => listener.userJoined({from: user}))
            resolve({
                send: (content) => {
                    let message = {from: user, content};
                    this.messages.push(message)
                    return this.start(resolve => {
                        this.eventListeners.filter(it => it !== chatMessageListener).forEach(it => it.messageArrived(message))
                        resolve(message)
                    }, rejection)
                }
            })
        }, rejection)
    }

    start(resolveWith, rejectWith) {
        let task = new Promise((resolve, reject) => {
            this.tasks.push({
                reject() {
                    return (rejectWith(reject), task)
                },
                resolve() {
                    return (resolveWith(resolve), task)
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
        return this.run(it => it.reject()).catch(() => (0))
    }

    run(handler) {
        return Promise.all(this.tasks.splice(0).map(handler));
    }
}
