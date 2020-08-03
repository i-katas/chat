import React from 'react'
import Chat from './Chat'
import ChatEndpoint from './ChatEndpoint'
import ReactDOM from 'react-dom'

ReactDOM.render(<Chat endpoint={new ChatEndpoint(process.env.webSocketServerURL || 'ws://localhost:8080/chat')}/>, document.querySelector('body'))