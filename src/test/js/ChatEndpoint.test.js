import ChatEndpoint from 'ChatEndpoint'
import WebSocket from 'ws'
import MockChatListener from "./mocks/MockChatListener";

describe('ChatEndpoint', () => {
    let server, chat;
    beforeEach(() => {
        server = new MockWebSocketServer()
        chat = new ChatEndpoint(server.location)
    })

    it('connect to chat server', (done) => {
        chat.join('bob', {
            userJoined({from}) {
                server.hasReceivedJoinedRequestFrom('bob');
                expect(from).toBeUndefined()
                done()
            }
        });
    });

    it('send joined messages from others to established connections', (done) => {
        let participants = []
        chat.join('bob', {
            userJoined({from}) {
                participants.push(from)
                server.hasReceivedJoinedRequestFrom('bob');
                if (participants.length === 2) {
                    expect(participants).toEqual([undefined, 'jack'])
                    done()
                }
            }
        });

        chat.join('jack', {
            userJoined() {
                server.hasReceivedJoinedRequestFrom('jack');
            }
        });
    });

    it('receives normal message from others', (done) => {
        chat.join('bob', {
            userJoined() {
            },
            messageArrived(message) {
                expect(message).toEqual({from: 'jack', content: 'ok'})
                done()
            }
        });

        let jack = chat.join('jack', new MockChatListener());
        jack.send('ok')
    });

    it('report error if join chat failed', (done) => {
        server.stop()

        chat.join('bob', {
            failed() {
                done()
            }
        });
    });

    it('report error if send message failed', (done) => {
        let bob = chat.join('bob', new MockChatListener());

        server.stop()

        bob.send('any').catch(() => done())
    });

    afterEach(() => server.stop())
});

class MockWebSocketServer {
    users = []
    sockets = []

    constructor() {
        this.server = new WebSocket.Server({port: 0});
        this.server.on('connection', (socket, request) => {
            let pos = request.url.lastIndexOf('/')
            let user = request.url.substring(pos + 1);
            this.users.push(user)
            this.sockets.push(socket)
            this.broadcast(user, user);
            socket.on('message', (message) => this.broadcast(user, {from: user, content: message}))
        })
    }

    broadcast(user, message) {
        this.sockets.filter((_, i) => this.users[i] !== user)
            .forEach(current => current.send(JSON.stringify(message)))
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