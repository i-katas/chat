import React from 'react'
import ChatState from 'ui/ChatState'
import {shallow} from 'enzyme'

describe('ChatState', () => {
    it('offline', () => {
        let state = shallow(<ChatState/>)

        expect(state.find('.chatState')).not.toHaveClassName('online')
    });

    it('online', () => {
        let state = shallow(<ChatState online={true}/>)

        expect(state.find('.chatState')).toHaveClassName('online')
    });
});