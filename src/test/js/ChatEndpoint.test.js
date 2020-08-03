import ChatEndpoint from 'ChatEndpoint'
import WebSocket from 'ws'

describe('ChatEndpoint', () => {
    let server;
    beforeEach(() => (server = new MockWebSocketServer(8080)))

    it('connect to chat server', (done) => {
        let chat = new ChatEndpoint(server.location)

        chat.join('bob', () => {
            server.hasReceivedJoinedRequestFrom('bob');
            done()
        });
    });

    afterEach(() => server.stop())
});

class MockWebSocketServer {
    constructor() {
        this.users = []
        this.server = new WebSocket.Server({port: 0});
        this.server.on('connection', (_, request) => {
            let pos = request.url.lastIndexOf('/')
            this.users.push(request.url.substring(pos + 1))
        })
    }

    get location() {
        return `ws://localhost:${this.server.address().port}/chat`
    }

    hasReceivedJoinedRequestFrom(user) {
        expect(this.users).toContain(user)
    }

    stop() {
        this.server.close()
    }
}