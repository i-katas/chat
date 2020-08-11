package com.ikatas.chat;

import com.ikatas.chat.api.Chat;
import com.ikatas.chat.api.ChatMessageListener;
import com.ikatas.chat.mem.SimpleChat;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import static com.ikatas.chat.api.Chat.ChatChannel;

@ServerEndpoint("/{user}")
public class ChatServer {
    private static final Chat chat = new SimpleChat();
    private ChatChannel channel;

    @OnOpen
    public void join(@PathParam("user") String user, Session session) {
        channel = chat.join(user, chatMessageDispatcherFor(session));
    }

    private ChatMessageListener chatMessageDispatcherFor(Session session) {
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
