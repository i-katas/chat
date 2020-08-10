import React from 'react'
import ChatEndpoint from '../ws/ChatEndpoint'
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
        this.props.endpoint.join(user, {
            userJoined: ({from}) => this.show({from, type: 'notice', content: `${from}已加入聊天!`}),
            messageArrived: (message) => this.show({type: 'message', ...message})
        }).then(chat => this.show({type: 'notice', content: '你已加入聊天!'}, chat)).catch(this.fail)
    }

    send = (message) => {
        this.state.chat.send(message)
            .then(() => this.show({type: 'message', content: message}))
            .catch(this.fail)
    }

    fail = () => {
        this.show({type: 'error notice', content: '连接服务器失败!'})
    }

    show(message, chat) {
        this.setState(prevState => ({
            chat: chat || prevState.chat,
            messages: prevState.messages.concat({...message, system: !message.from, from: message.from || '我'})
        }))
    }
}

Chat.propTypes = {
    endpoint: PropTypes.instanceOf(ChatEndpoint).isRequired
};

