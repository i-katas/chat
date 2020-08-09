import '../scss/chat.scss'
import React from 'react'
import Chat from './ui/Chat'
import ChatEndpoint from './ws/ChatEndpoint'
import ReactDOM from 'react-dom'

ReactDOM.render(<Chat endpoint={new ChatEndpoint(process.env.webSocketServerURL || 'ws://localhost:8080/chat')}/>, document.querySelector('body'))