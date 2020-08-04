import React from "react";
import PropTypes from 'prop-types'
import string from './string'
import withControlBox from "./withControlBox";

const JoinBox = withControlBox({
    field(value, onChange) {
        return <input id='user' type='text' value={value} onChange={onChange}/>
    },
    button(value, disabled, reset, {join}) {
        return <button id='join' type='button' disabled={disabled} onClick={() => (reset(), join(string.trim(value)))}>加入</button>
    }
})

JoinBox.propTypes = {
    join: PropTypes.func.isRequired
}

export default JoinBox