import React from "react";
import PropTypes from 'prop-types'
import string from "./string";

export default class MessageBox extends React.Component {
    render() {
        let {messages = []} = this.props
        return (
            <div className='messageBox'>
                {messages.map(this.renderMessage)}
            </div>
        )
    }

    renderMessage(message, i) {
        let content = {__html: string.escape(message.content)};
        if (message.type == 'message') {
            return (
                <Message message={message} key={i}>
                    <div className='user'>{message.from}</div>
                    <div className='content' dangerouslySetInnerHTML={content}/>
                </Message>
            )
        }
        return <Message message={message} key={i}><em dangerouslySetInnerHTML={content}/></Message>
    }
}

function Message({message, children}) {
    return <div className={message.system ? message.type : `${message.type} other`}>{children}</div>
}

const MessageType = PropTypes.shape({
    type: PropTypes.string.isRequired,
    system: PropTypes.bool,
    from: PropTypes.string,
    content: PropTypes.string.isRequired
});
MessageBox.propTypes = {
    messages: PropTypes.arrayOf(MessageType)
}
