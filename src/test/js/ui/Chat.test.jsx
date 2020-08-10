import '@babel/polyfill'
import MockChatEndpoint from '../ws/mocks/MockChatEndpoint'
import Chat from 'ui/Chat'
import {mount} from 'enzyme'
import React from 'react'

describe('Chat', () => {
    let server;
    beforeEach(() => server = new MockChatEndpoint())

    function join(name) {
        let chat = mount(<Chat endpoint={server}/>);
        chat.find('#user').simulate('change', {target: {value: name}})
        chat.find('#join').simulate('click')
        return chat;
    }

    describe('interaction', () => {
        it('shows joined message after join chat success', async () => {
            let chat = join('bob');

            server.hasReceivedJoinRequestFrom('bob');

            await server.ack()
            chat.update()
            expect(chat.find('.messageBox').find('.notice')).toHaveText('你已加入聊天!')
        });

        it('reports error message when join chat failed', async () => {
            let chat = join('bob');
            server.hasReceivedJoinRequestFrom('bob')

            await server.fail()
            chat.update()

            expect(chat.find('.messageBox').find('.error.notice')).toHaveText('连接服务器失败!')
            expect(chat.find('#user')).toExist()
        });

        it('reports error message when send message failed', async () => {
            let chat = join('bob');
            await server.ack()
            chat.update()

            chat.find('#message').simulate('change', {target: {value: 'hello'}})
            chat.find('#send').simulate('click')
            chat.update()

            server.hasReceivedMessageFrom('bob', 'hello')
            await server.fail()
            chat.update()
            expect(chat.find('.messageBox').find('.error.notice')).toHaveText('连接服务器失败!')
        });

        it('receives joined message from others after join chat', async () => {
            let bob = join('bob')
            let jack = join('jack')

            await server.ack()
            jack.update()
            bob.update()

            expect(jack.find('.messageBox').find('.other.notice')).toHaveLength(0)
            expect(bob.find('.messageBox').find('.other.notice')).toHaveText('jack已加入聊天!')
        });

        it('receives normal message from others after join chat', async () => {
            let bob = join('bob')
            let jack = join('jack')

            await server.ack()
            jack.update()

            jack.find('#message').simulate('change', {target: {value: 'hello'}})
            jack.find('#send').simulate('click')

            server.hasReceivedMessageFrom('jack', 'hello')
            await server.ack()
            bob.update()
            jack.update()
            expect(bob.find('.other.message .user')).toHaveText('jack')
            expect(bob.find('.other.message .content')).toHaveText('hello')
            expect(jack.find('.message .user')).toHaveText('我')
            expect(jack.find('.message .content')).toHaveText('hello')
        });
    });

    describe('ui', () => {
        it('displays sending components after joined', async () => {
            let chat = join('bob');

            await server.ack()
            chat.update()

            expect(chat.find('#user')).not.toExist()
            expect(chat.find('#message')).toExist()
        });
    });
})

