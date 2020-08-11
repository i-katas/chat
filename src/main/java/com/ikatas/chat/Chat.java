package com.ikatas.chat;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;
import java.util.stream.Stream;

public class Chat {
    private final Map<String, ChatMessageListener> messageListeners = new ConcurrentHashMap<>();

    public ChatChannel join(String user, ChatMessageListener chatMessageListener) {
        SimpleChatChannel channel = new SimpleChatChannel(user);
        channel.join(chatMessageListener);
        return channel;
    }

    private class SimpleChatChannel implements ChatChannel {
        private String user;

        public SimpleChatChannel(String user) {
            this.user = user;
        }

        public void join(ChatMessageListener chatMessageListener) {
            ensureOpen();
            messageListeners.put(user, chatMessageListener);
            broadcast(listener -> listener.userJoined(user));
        }

        @Override
        public void send(String message) {
            ensureOpen();
            broadcast(listener -> listener.messageReceived(user, message));
        }

        private void ensureOpen() {
            if (user == null) {
                throw new IllegalStateException("Channel closed");
            }
        }

        private void broadcast(Consumer<ChatMessageListener> action) {
            chatMessageListeners(user).forEach(action);
        }

        @Override
        public void close() {
            messageListeners.remove(user);
            user = null;
        }
    }

    private Stream<ChatMessageListener> chatMessageListeners(String user) {
        return messageListeners.entrySet().stream().filter(it -> !it.getKey().equals(user)).map(Map.Entry::getValue);
    }

    public interface ChatChannel {

        void send(String message);

        void close();

    }
}
