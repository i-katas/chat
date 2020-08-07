export default chatListener => {
    return ({data, type}) => {
        if(type === 'error') {
            chatListener.failed()
            return;
        }
        let event = data && JSON.parse(data);
        if (event && typeof event === 'object') {
            chatListener.messageArrived(event)
        } else {
            chatListener.userJoined({from: event})
        }
    }
}
