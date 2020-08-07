export default class MockChatListener {
    joinedUsers = []
    messages = []

    userJoined(user) {
        this.joinedUsers.push(user)
    }

    messageArrived(message) {
        this.messages.push(message)
    }

    hasReceivedJoinedRequestFrom(user) {
        expect(this.joinedUsers).toContainEqual({from: user})
    }

    hasReceivedMessageFrom(user, message) {
        expect(this.messages).toContainEqual({from: user, message})
    }

    failed() {
        this.failed = true
    }

    hasFailed() {
        expect(this.failed).toBe(true)
    }

}
