package com.ikatas.chat;

import org.json.JSONTokener;
import org.junit.Test;

import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

public class ChatTest {
    private final Chat chat = new Chat();
    private final MockChatMessageListener frontListener = new MockChatMessageListener();
    private final MockChatMessageListener backListener = new MockChatMessageListener();

    @Test
    public void receivesAJoinedMessageAfterOthersJoined() {
        chat.join("bob", frontListener);
        frontListener.hasNoJoinedMessageReceived();

        chat.join("jack", backListener);
        frontListener.hasReceivedJoinedMessageFrom("jack");
        backListener.hasNoJoinedMessageReceived();
    }

    @Test
    public void receivesAMessageSentByOthers() {
        chat.join("bob", frontListener).send("first");
        frontListener.hasNoMessageReceivedFromOthers();

        chat.join("jack", backListener).send("ok");

        backListener.hasNoMessageReceivedFromOthers();
        frontListener.hasReceivedMessageFrom("jack", "ok");
    }

    @Test
    public void stopReceivesMessageWhenDisconnectedFromChat() {
        chat.join("bob", frontListener).close();

        chat.join("jack", backListener).send("ok");

        frontListener.hasNoJoinedMessageReceived();
    }

    private static class MockChatMessageListener implements ChatMessageListener {
        private final List<String> users = new ArrayList<>();
        private final List<Map.Entry<String, String>> messages = new ArrayList<>();

        public void hasNoJoinedMessageReceived() {
            assertThat(users, is(empty()));
        }

        public void hasReceivedJoinedMessageFrom(String user) {
            assertThat(users, hasItem(user));
        }

        @Override
        public void userJoined(String user) {
            users.add((String) parse(user));
        }

        @Override
        public void messageReceived(String user, String message) {
            messages.add(new SimpleEntry<>(user, message));
        }

        public void hasNoMessageReceivedFromOthers() {
            assertThat(messages, is(empty()));
        }

        private Object parse(String json) {
            return new JSONTokener(json).nextValue();
        }

        public void hasReceivedMessageFrom(String user, String message) {
            assertThat(messages, hasItem(new SimpleEntry<>(user, message)));
        }
    }
}