import ChatEndpoint from 'ChatEndpoint'
import WebSocket from 'ws'

describe('ChatEndpoint', () => {
    let server;
    beforeEach(() => (server = new MockWebSocketServer(8080)))

    it('connect to chat server', (done) => {
        let chat = new ChatEndpoint(server.location)

        chat.join('bob', {
            joined({from}) {
                server.hasReceivedJoinedRequestFrom('bob');
                expect(from).toBeUndefined()
                done()
            }
        });
    });

    it('send joined messages from others to established connections', (done) => {
        let chat = new ChatEndpoint(server.location)
        let participants = []
        chat.join('bob', {
            joined({from}) {
                participants.push(from)
                server.hasReceivedJoinedRequestFrom('bob');
                if (participants.length === 2) {
                    expect(participants).toEqual([undefined, 'jack'])
                    done()
                }
            }
        });

        chat.join('jack', {
            joined() {
                server.hasReceivedJoinedRequestFrom('jack');
            }
        });
    });

    afterEach(() => server.stop())
});

class MockWebSocketServer {
    constructor() {
        this.users = []
        this.connections = []
        this.server = new WebSocket.Server({port: 0});
        this.server.on('connection', (socket, request) => {
            let pos = request.url.lastIndexOf('/')
            let user = request.url.substring(pos + 1);
            this.users.push(user)
            this.connections[user] = socket
            this.users.forEach(current => {
                if (current !== user) {
                    this.connections[current].send(user)
                }
            })
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