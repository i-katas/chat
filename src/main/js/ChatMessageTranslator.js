export default chatListener => {
    return (event) => {
        let {data: raw, type} = event
        if(type === 'error') {
            chatListener.failed()
            return;
        }
        let data = raw && JSON.parse(raw);
        if (data && typeof data === 'object') {
            chatListener.messageArrived(data)
        } else {
            chatListener.userJoined({from: data})
        }
    }
}
