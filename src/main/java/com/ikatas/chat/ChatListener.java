package com.ikatas.chat;

public interface ChatListener {
    void userJoined(String user);

    void messageReceived(String user, String message);
}
