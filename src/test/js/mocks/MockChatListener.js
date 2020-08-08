export default class MockChatListener {
    users = []
    messages = []

    userJoined(user) {
        this.users.push(user)
    }

    messageArrived(message) {
        this.messages.push(message)
    }

    //todo: rename to hasReceivedJoinRequestFrom
    hasReceivedJoinedRequestFrom(user) {
        expect(this.users).toContainEqual({from: user})
    }

    hasReceivedMessageFrom(user, message) {
        expect(this.messages).toContainEqual({from: user, message})
    }

    failed() {
        this.error = true
    }

    hasFailed() {
        expect(this.error).toBe(true)
    }
}
