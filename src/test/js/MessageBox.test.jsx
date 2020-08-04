import React from "react";
import MessageBox from 'MessageBox'
import {shallow} from 'enzyme'

describe('MessageBox', () => {
    it('render empty messages', () => {
        let messageBox = mount(<MessageBox/>);

        expect(messageBox.find('.messageBox').children()).toHaveLength(0)
    })

    it('render notify messages', () => {
        let messageBox = mount(<MessageBox messages={[{type: 'notice', content: 'ok'}]}/>);

        expect(messageBox.find('.messageBox').children()).toHaveLength(1)
        expect(messageBox.find('.messageBox').find('.notice')).toHaveText('ok')
    })
});
