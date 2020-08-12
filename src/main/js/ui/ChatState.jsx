import React from 'react'
import PropTypes from 'prop-types'

export default class ChatState extends React.Component {
    render() {
        return <div className={this.props.online ? 'chatState online' : 'chatState'}/>
    }
}

ChatState.propTypes = {
    online: PropTypes.bool
}