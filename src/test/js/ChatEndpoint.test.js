import ChatEndpoint from 'ChatEndpoint'
import WebSocket from 'ws'
import MockChatListener from "./mocks/MockChatListener";

describe('ChatEndpoint', () => {
    let server, chat;
    beforeEach(() => {
        server = new MockWebSocketServer()
        chat = new ChatEndpoint(server.location)
    })

    it('connect to chat server', () => {
        return chat.join('bob', {
            userJoined({from}) {
                server.hasReceivedJoinedRequestFrom('bob');
                expect(from).toBeUndefined()
            }
        });
    });

    it('send joined messages from others to established connections', (done) => {
        chat.join('bob', {
            userJoined({from}) {
                if (from) {
                    expect(from).toEqual('jack')
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

        chat.join('jack', new MockChatListener()).then(jack => jack.send('ok'))
    });

    it('report error if join chat failed', (done) => {
        server.stop()

        expect.assertions(1)

        chat.join('bob', {
            failed() {
                expect(true).toBe(true)
            }
        }).catch(() => done());
    });

    it('report error if send message failed', (done) => {
        let listener = new MockChatListener();

        chat.join('bob', listener).then(bob => {
            server.stop(() => bob.send('any').then(done).catch(() => done()))
        })
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

    stop(callback) {
        this.server.close(callback)
    }
}