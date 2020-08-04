export default chatListener => {
    return ({data}) => {
        let event = data && JSON.parse(data);

        if (event && typeof event === 'object') {
            chatListener.messageArrived(event)
        } else {
            chatListener.userJoined({from: event})
        }
    }
}
