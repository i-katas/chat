package com.ikatas.chat;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class Chat {
    private final List<ChatListener> chatListeners = new CopyOnWriteArrayList<>();

    public void join(String user, ChatListener chatListener) {
        for (ChatListener listener : chatListeners) {
            listener.userJoined(user);
        }
        chatListeners.add(chatListener);
    }
}
