package com.ikatas.chat.api;

public interface ChatMessageListener {
    void userJoined(String user);

    void messageReceived(String user, String message);
}
