import SendBox from 'ui/SendBox'
import {mount} from 'enzyme'
import React from 'react'

describe('SendBox', () => {
    it('send button disabled with empty message', () => {
        let sendBox = mount(<SendBox send={jest.fn()}/>)

        expect(sendBox.find('#send')).toBeDisabled()
    });

    it('send button is enabled when typed non-empty message', () => {
        let sendBox = mount(<SendBox send={jest.fn()}/>)

        sendBox.find('#message').simulate('change', {target: {value: '   '}});
        sendBox.update()
        expect(sendBox.find('#send')).toBeDisabled()

        sendBox.find('#message').simulate('change', {target: {value: 'msg'}});
        sendBox.update()
        expect(sendBox.find('#send')).not.toBeDisabled()
    });

    it('send & clear message once the send button clicked', () => {
        let messages = []
        let sendBox = mount(<SendBox send={messages.push.bind(messages)}/>)

        sendBox.find('#message').simulate('change', {target: {value: 'msg'}});
        sendBox.find('#send').simulate('click')
        sendBox.update()

        expect(messages).toEqual(['msg'])
        expect(sendBox.find('#message')).toHaveValue('')
    });
});