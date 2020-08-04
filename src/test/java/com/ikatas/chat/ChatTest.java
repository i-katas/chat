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

    @Test
    public void receivesJoinedMessageFromOthersAfterJoined() {
        Chat chat = new Chat();
        MockChatListener frontListener = new MockChatListener();
        MockChatListener backListener = new MockChatListener();

        chat.join("bob", frontListener);
        frontListener.hasNoJoinedMessageReceived();

        chat.join("jack", backListener);
        frontListener.hasReceivedJoinedMessageFrom("jack");
        backListener.hasNoJoinedMessageReceived();
    }

    @Test
    public void receivesMessageSentByOthers() {
        Chat chat = new Chat();
        MockChatListener frontListener = new MockChatListener();
        MockChatListener backListener = new MockChatListener();
        chat.join("bob", frontListener);

        chat.join("jack", backListener).send("ok");

        backListener.hasNoMessageReceivedFromOthers();
        frontListener.hasReceivedMessageFrom("jack", "ok");
    }

    private static class MockChatListener implements ChatListener {
        private final List<String> joinedUsers = new ArrayList<>();
        private final List<Map.Entry<String, String>> messages = new ArrayList<>();

        public void hasNoJoinedMessageReceived() {
            assertThat(joinedUsers, is(empty()));
        }

        public void hasReceivedJoinedMessageFrom(String user) {
            assertThat(joinedUsers, hasItem(user));
        }

        @Override
        public void userJoined(String user) {
            joinedUsers.add((String) parse(user));
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