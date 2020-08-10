package com.ikatas.chat;

import com.ikatas.chat.Chat.ChatChannel;
import org.json.JSONObject;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

import static org.json.JSONObject.valueToString;

@ServerEndpoint("/{user}")
public class ChatServer {
    private static final Chat chat = new Chat();
    private ChatChannel channel;

    @OnOpen
    public void join(@PathParam("user") String user, Session session) {
        channel = chat.join(user, messageDispatcher(session));
    }

    private ChatListener messageDispatcher(Session session) {
        return new ChatListener() {
            @Override
            public void userJoined(String user) {
                dispatch(user);
            }

            @Override
            public void messageReceived(String user, String message) {
                dispatch(messageFrom(user, message));
            }

            private JSONObject messageFrom(String user, String message) {
                return new JSONObject().put("from", user).put("content", message);
            }

            private void dispatch(Object value) {
                try {
                    session.getBasicRemote().sendText(valueToString(value));
                } catch (IllegalStateException | IOException e) {
                    //todo: exit to chat
                    e.printStackTrace();
                }
            }
        };
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
