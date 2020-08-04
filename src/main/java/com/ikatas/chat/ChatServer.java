package com.ikatas.chat;

import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint("/{user}")
public class ChatServer {
    private static final Chat chat = new Chat();

    @OnOpen
    public void join(@PathParam("user") String user, Session session) {
        chat.join(user, joined -> {
            try {
                session.getBasicRemote().sendText(joined);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }
}
