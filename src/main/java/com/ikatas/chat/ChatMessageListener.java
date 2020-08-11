package com.ikatas.chat;

public interface ChatMessageListener {
    void userJoined(String user);

    void messageReceived(String user, String message);
}
