# Chat UI
- Join to chat 
    - display all joined users after joined into the chat
    - ?join chat with duplicated user name that has already joined in chat
    - ~~separate join action from join message in chatMessageListener~~
    - ~~encapsulate the chat related events in Promise, e.g: join, error, close event~~
- ~~Send a notification to everyone who has joined in chat~~
- Notify when someone left out of the chat
- Scroll to the bottom of the message box when show a message if scrollbar at the bottom
- Retry connect to chat periodically if the connection lost
- ~~Show chat connection state~~


# Server
- ~~Disconnect when dispatch notification/message failed on server~~
- ~~fails to send the message if the channel has closed~~
- ~~Close chat channel when user has disconnected from chat~~
