import '@babel/polyfill'
import ChatEndpoint from 'ws/ChatEndpoint'
import {Server} from 'ws'

describe('ChatEndpoint', () => {
    let server, chat;
    const UNUSED_MESSAGE_LISTENER = {};
    beforeEach(() => {
        server = new MockWebSocketServer()
        chat = new ChatEndpoint(server.location)
    })

    it('connect to chat server', async () => {
        await chat.join('bob', UNUSED_MESSAGE_LISTENER);
    });

    it('send joined messages from others to established connections', (done) => {
        chat.join('bob', {
            userJoined({from}) {
                server.hasReceivedJoinRequestFrom('jack');
                expect(from).toEqual('jack')
                done()
            }
        });

        chat.join('jack');
    });

    it('receives normal message from others', (done) => {
        chat.join('bob', {
            userJoined() {
            },
            messageArrived(message) {
                expect(message).toEqual({from: 'jack', content: 'ok'})
                done()
            }
        })

        chat.join('jack', UNUSED_MESSAGE_LISTENER).then(jack => jack.send('ok'));
    });

    it('report error if join chat failed', (done) => {
        server.stop(() => {
            chat.join('bob', UNUSED_MESSAGE_LISTENER).catch(() => done());
        })
    });

    it('report error if send message failed', (done) => {
        chat.join('bob', UNUSED_MESSAGE_LISTENER).then(bob => {
            server.stop(() => bob.send('any').then(done).catch(() => done()))
        })
    });

    it('notify chat is opened after joined', done => {
        chat.join('bob', open => {
            expect(open).toBe(true)
            done()
        })
    });

    it('notify chat is not opened if join failed', done => {
        server.stop(() => {
            chat.join('bob', open => {
                expect(open).toBe(false)
                done()
            })
        })
    });

    afterEach(done => server.stop(done))
});

class MockWebSocketServer {
    users = []
    sockets = []

    constructor() {
        this.server = new Server({port: 0});
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

    hasReceivedJoinRequestFrom(user) {
        expect(this.users).toContain(user)
    }

    stop(callback) {
        this.sockets.forEach(it => (it.close(), it.terminate()))
        this.server.close(callback)
    }
}
