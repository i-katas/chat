import React from 'react'
import ChatEndpoint from '../ws/ChatEndpoint'
import MessageBox from './MessageBox'
import JoinBox from './JoinBox'
import SendBox from './SendBox'
import ChatState from './ChatState'
import PropTypes from 'prop-types'

export default class Chat extends React.Component {
    state = {chat: null, offline: false, messages: []};

    render() {
        let {chat, online, messages} = this.state
        return (
            <div className='chat'>
                <ChatState online={online}/>
                <MessageBox messages={messages}/>
                {chat ? <SendBox send={this.send}/> : <JoinBox join={this.join}/>}
            </div>
        )
    }

    join = (user) => {
        let chatMessageListener = {
            userJoined: ({from}) => this.show({from, type: 'notice', content: `${from}已加入聊天!`}),
            messageArrived: (message) => this.show({type: 'message', ...message})
        };

        this.props.endpoint.join(user, online => this.setState({online}), chatMessageListener)
            .then(chat => this.show({type: 'notice', content: '你已加入聊天!'}, chat)).catch(this.fail)
    }

    send = (message) => {
        this.state.chat.send(message)
            .then(() => this.show({type: 'message', content: message}))
            .catch(this.fail)
    }

    fail = () => {
        this.show({type: 'error notice', content: '连接服务器失败!'})
    }

    show(message, currentChat) {
        this.setState(({chat, messages}) => ({
            chat: currentChat || chat,
            messages: messages.concat({...message, system: !message.from, from: message.from || '我'})
        }))
    }
}

Chat.propTypes = {
    endpoint: PropTypes.instanceOf(ChatEndpoint).isRequired
};

