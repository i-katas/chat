import MockChatEndpoint from './mocks/MockChatEndpoint'
import Chat from 'Chat'
import {mount} from 'enzyme'
import React from 'react'

describe('Chat', () => {
    let server;
    beforeEach(() => {
        server = new MockChatEndpoint();
    })

    function join(name) {
        let chat = mount(<Chat endpoint={server}/>);
        chat.find('#user').simulate('change', {target: {value: name}})
        chat.find('#join').simulate('click')

        server.hasReceivedJoinRequestFrom('bob');
        server.ack();
        chat.update()
        return chat;
    }

    describe('interaction', () => {
        it('shows joined message after join chat success', () => {
            let chat = join('bob');

            expect(chat.find('.messageBox').find('.notice')).toHaveText('你已加入聊天!')
        });

        it('receives joined message from others after join chat', () => {
            let bob = join('bob')

            let jack = join('jack')

            bob.update()
            expect(jack.find('.messageBox').find('.other.notice')).toHaveLength(0)
            expect(bob.find('.messageBox').find('.other.notice')).toHaveText('jack已加入聊天!')
        });

        it('receives normal message from others after join chat', () => {
            let bob = join('bob')
            let jack = join('jack')

            jack.find('#message').simulate('change', {target: {value: 'hello'}})
            jack.find('#send').simulate('click')
            jack.update()

            server.hasSentMessageFrom('jack', 'hello')
            bob.update()
            expect(bob.find('.other.message .user')).toHaveText('jack')
            expect(bob.find('.other.message .content')).toHaveText('hello')
            expect(jack.find('.message .user')).toHaveText('我')
            expect(jack.find('.message .content')).toHaveText('hello')
        });
    });

    describe('ui', () => {
        it('displays sending components after joined', () => {
            let chat = join('bob');

            expect(chat.find('#user')).not.toExist()
            expect(chat.find('#message')).toExist()
        });
    });
})
