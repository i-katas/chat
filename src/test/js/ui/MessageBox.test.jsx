import React from 'react';
import MessageBox from 'ui/MessageBox'

const TYPE_MESSAGE = 'message';
const TYPE_NOTICE = 'notice';
describe('MessageBox rendering', () => {
    it('empty messages', () => {
        let messageBox = mount(<MessageBox/>);

        expect(messageBox.find('.messageBox').children()).toHaveLength(0)
    })

    describe('notice', () => {
        it('from system', () => {
            let messageBox = mount(<MessageBox messages={[{type: TYPE_NOTICE, system: true, content: 'ok'}]}/>);
            let notice = messageBox.find('.messageBox').find('.notice');

            expect(notice).not.toHaveClassName('other')
            expect(notice).toHaveText('ok')
        })

        it('from others', () => {
            let messageBox = mount(<MessageBox messages={[{type: TYPE_NOTICE, from: 'bob', system: false, content: 'ok'}]}/>);
            let notice = messageBox.find('.messageBox').find('.notice');

            expect(notice).toHaveClassName('other')
            expect(notice).toHaveText('ok')
        })

        it('escape line-break to <br/>', () => {
            let messageBox = mount(<MessageBox messages={[{type: TYPE_NOTICE, system: true, content: 'first\nlast'}]}/>);

            expect(messageBox.html()).toEqual(expect.stringContaining('first<br>last'))
        })

    });

    describe('normal message', () => {
        it('from system', () => {
            let messageBox = mount(<MessageBox messages={[{type: TYPE_MESSAGE, from: 'me', system: true, content: 'ok'}]}/>);
            let message = messageBox.find('.message')

            expect(message.find('.user')).toHaveText('me')
            expect(message.find('.content')).toHaveText('ok')
            expect(message).not.toHaveClassName('other')
        })

        it('from others', () => {
            let messageBox = mount(<MessageBox messages={[{type: TYPE_MESSAGE, from: 'me', system: false, content: 'ok'}]}/>);
            let message = messageBox.find('.message')

            expect(message.find('.user')).toHaveText('me')
            expect(message.find('.content')).toHaveText('ok')
            expect(message).toHaveClassName('other')
        })

        it('escape line-break to <br/>', () => {
            let messageBox = mount(<MessageBox messages={[{type: TYPE_MESSAGE, system: true, content: 'first\nlast'}]}/>);

            expect(messageBox.html()).toEqual(expect.stringContaining('first<br>last'))
        })

    });
});
