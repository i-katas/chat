import JoinBox from 'ui/JoinBox'
import {mount} from 'enzyme'
import React from 'react'

describe('SendBox', () => {
    it('join button disabled with empty user', () => {
        let box = mount(<JoinBox join={jest.fn()}/>)

        expect(box.find('#join')).toBeDisabled()
    });

    it('join button is enabled when typed non-empty user', () => {
        let box = mount(<JoinBox join={jest.fn()}/>)

        box.find('#user').simulate('change', {target: {value: '   '}});
        box.update()
        expect(box.find('#join')).toBeDisabled()

        box.find('#user').simulate('change', {target: {value: 'bob'}});
        box.update()
        expect(box.find('#join')).not.toBeDisabled()
    });

    it('join to chat when the join button clicked', () => {
        let listener = jest.fn()
        let box = mount(<JoinBox join={listener}/>)

        box.find('#user').simulate('change', {target: {value: 'bob'}});
        box.find('#join').simulate('click')
        box.update()

        expect(listener).toBeCalledWith('bob')
    });

    it('join user is trimmed', () => {
        let listener = jest.fn()
        let box = mount(<JoinBox join={listener}/>)

        box.find('#user').simulate('change', {target: {value: ' bob '}});
        box.find('#join').simulate('click')
        box.update()

        expect(listener).toBeCalledWith('bob')
    });
});