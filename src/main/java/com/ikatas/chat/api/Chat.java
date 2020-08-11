package com.ikatas.chat.api;

public interface Chat {
    ChatChannel join(String user, ChatMessageListener chatMessageListener);

    interface ChatChannel {
        void send(String message);

        void close();
    }
}
