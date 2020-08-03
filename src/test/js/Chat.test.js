import ChatEndpoint from "ChatEndpoint";
import Chat from 'Chat'
import {mount} from 'enzyme'
import React from "react";

describe('Chat', () => {
    it('shows joined message after join chat success', () => {
        let server = new MockChatEndpoint();
        let chat = mount(<Chat endpoint={server}/>)

        chat.find('#user').simulate('change', {target: {value: 'bob'}})
        chat.find('#join').simulate('click')

        server.hasReceivedJoinRequestFrom('bob');
        server.ackAllJoinRequests();
        chat.update()

        expect(chat.find('.messageBox').find('.notice')).toHaveText('你已加入聊天!')
    });
})

class MockChatEndpoint extends ChatEndpoint {
    constructor() {
        super()
        this.users = []
        this.eventListeners = []
    }

    join(user, eventListener) {
        this.users.push(user)
        this.eventListeners.push(eventListener)
    }

    hasReceivedJoinRequestFrom(user) {
        expect(this.users).toContain(user)
    }

    ackAllJoinRequests() {
        this.eventListeners.forEach(eventListener => eventListener())
    }
}