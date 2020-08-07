import React from 'react'
import ChatEndpoint from './ChatEndpoint'
import MessageBox from './MessageBox'
import JoinBox from './JoinBox'
import SendBox from './SendBox'
import PropTypes from 'prop-types'

export default class Chat extends React.Component {
    state = {messages: []};

    render() {
        let {messages, chat} = this.state
        return (
            <div className='chat'>
                <MessageBox messages={messages}/>
                {chat ? <SendBox send={this.send}/> : <JoinBox join={this.join}/>}
            </div>
        )
    }

    join = (user) => {
        let chat = this.props.endpoint.join(user, {
            userJoined: ({from}) => {
                this.addMessage({from, system: !from, type: 'notice', content: from ? `${from}已加入聊天!` : '你已加入聊天!'})
                this.setState({chat: chat})
            },
            messageArrived: (message) => this.addMessage({type: 'message', system: false, ...message}),
            failed: this.fail
        })
    }

    send = (message) => {
        this.state.chat.send(message)
            .then(() => this.addMessage({type: 'message', system: true, from: '我', content: message}))
            .catch(this.fail)
    }

    fail = () => {
        this.addMessage({system: true, type: 'error notice', content: '连接服务器失败!'})
    }

    addMessage(message) {
        this.setState(prevState => ({prevState, messages: prevState.messages.concat(message)}))
    }
}

Chat.propTypes = {
    endpoint: PropTypes.instanceOf(ChatEndpoint).isRequired
};

