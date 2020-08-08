export default class MockChatListener {
    users = []
    messages = []

    userJoined(user) {
        this.users.push(user)
    }

    messageArrived(message) {
        this.messages.push(message)
    }

    hasReceivedJoinRequestFrom(user) {
        expect(this.users).toContainEqual({from: user})
    }

    hasReceivedMessageFrom(user, message) {
        expect(this.messages).toContainEqual({from: user, message})
    }
}
