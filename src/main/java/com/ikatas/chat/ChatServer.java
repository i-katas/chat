package com.ikatas.chat;

import com.ikatas.chat.Chat.ChatChannel;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/{user}")
public class ChatServer {
    private static final Chat chat = new Chat();
    private ChatChannel channel;

    @OnOpen
    public void join(@PathParam("user") String user, Session session) {
        channel = chat.join(user, chatMessageDispatcherFor(session));
    }

    private ChatMessageDispatcher chatMessageDispatcherFor(Session session) {
        return new ChatMessageDispatcher(session.getBasicRemote(), ex -> channel.close());
    }

    @OnMessage
    public void onMessage(String message) {
        channel.send(message);
    }

    @OnClose
    public void disconnect() {
        channel.close();
    }

}
