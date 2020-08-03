import React from "react";
import PropTypes from "prop-types";

export default class MessageBox extends React.Component {
    render() {
        let {messages = []} = this.props
        return (
            <div className='messageBox'>
                {messages.map((message, i) => <div className='notice' key={i}>{message}</div>)}
            </div>
        )
    }
}

MessageBox.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.string)
}
