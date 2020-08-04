import React from "react";
import PropTypes from 'prop-types'
import withControlBox from "./withControlBox";

const SendBox = withControlBox({
    field(value, onChange) {
        return <textarea id='message' value={value} onChange={onChange}/>
    },
    button(value, disabled, reset, {send}) {
        return <button id='send' type='button' disabled={disabled} onClick={() => (reset(), send(value))}>发送</button>
    }
})

SendBox.propTypes = {
    send: PropTypes.func.isRequired
}

export default SendBox