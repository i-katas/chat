package com.ikatas.chat;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;
import java.util.stream.Stream;

public class Chat {
    private final Map<String, ChatListener> chatListeners = new ConcurrentHashMap<>();

    public ChatChannel join(String user, ChatListener chatListener) {
        broadcastBy(user, listener -> listener.userJoined(user));
        chatListeners.put(user, chatListener);

        return message -> broadcastBy(user, listener -> listener.messageReceived(user, message));
    }

    private void broadcastBy(String user, Consumer<ChatListener> action) {
        chatListeners(user).forEach(action);
    }

    private Stream<ChatListener> chatListeners(String user) {
        return chatListeners.entrySet().stream().filter(it -> !it.getKey().equals(user)).map(Map.Entry::getValue);
    }

    public interface ChatChannel {
        void send(String message);
    }
}
