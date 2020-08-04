import React from "react";
import PropTypes from "prop-types";

export default class MessageBox extends React.Component {
    render() {
        let {messages = []} = this.props
        return (
            <div className='messageBox'>
                {messages.map((message, i) => <div className={message.type} key={i}>{message.content}</div>)}
            </div>
        )
    }
}

const Message = PropTypes.shape({
    type: PropTypes.string,
    content: PropTypes.string
});
MessageBox.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, Message]))
}
