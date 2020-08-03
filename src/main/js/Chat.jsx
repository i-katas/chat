import React from 'react'
import ChatEndpoint from './ChatEndpoint'
import MessageBox from './MessageBox'
import PropTypes from 'prop-types'

export default class Chat extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            messages: [],
            user: ''
        };
    }

    render() {
        return (
            <div className='chat'>
                <MessageBox messages={this.state.messages}/>
                <div>
                    <input id='user' type='text' value={this.state.user} onChange={(event) => this.userChanged(event.target.value)}/>
                    <button id='join' type='button' onClick={() => this.join(this.state.user)}>加入</button>
                </div>
            </div>
        )
    }

    join(user) {
        let {endpoint} = this.props
        endpoint.join(user, () => this.addMessage('你已加入聊天!'))
    }

    userChanged(value) {
        this.setState((prevState) => ({prevState, user: value}))
    }

    addMessage(message) {
        this.setState(prevState => ({prevState, messages: prevState.messages.concat(message)}))
    }
}

Chat.propTypes = {
    endpoint: PropTypes.instanceOf(ChatEndpoint).isRequired
};
