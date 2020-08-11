package com.ikatas.chat;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;
import java.util.stream.Stream;

public class Chat {
    private final Map<String, ChatMessageListener> messageListeners = new ConcurrentHashMap<>();

    public ChatChannel join(String user, ChatMessageListener chatMessageListener) {
        messageListeners.put(user, chatMessageListener);
        broadcastBy(user, listener -> listener.userJoined(user));

        return new ChatChannel() {
            @Override
            public void send(String message) {
                broadcastBy(user, listener -> listener.messageReceived(user, message));
            }

            @Override
            public void close() {
                messageListeners.remove(user);
            }
        };
    }

    private void broadcastBy(String user, Consumer<ChatMessageListener> action) {
        chatMessageListeners(user).forEach(action);
    }

    private Stream<ChatMessageListener> chatMessageListeners(String user) {
        return messageListeners.entrySet().stream().filter(it -> !it.getKey().equals(user)).map(Map.Entry::getValue);
    }

    public interface ChatChannel {
        void send(String message);

        void close();
    }
}
