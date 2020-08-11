package com.ikatas.chat.api;

import com.ikatas.chat.mem.SimpleChat;
import org.json.JSONTokener;
import org.junit.Test;

import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.ikatas.chat.api.Chat.ChatChannel;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.fail;
import static org.junit.internal.matchers.ThrowableMessageMatcher.hasMessage;

public class ChatTest {
    private final Chat chat = new SimpleChat();
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

    @Test
    public void failsToSendingMessageIfChannelWasClosed() {
        ChatChannel channel = chat.join("bob", backListener);

        channel.close();

        try {
            channel.send("anything");
            fail("Send message after closed");
        } catch (IllegalStateException expected) {
            assertThat(expected, hasMessage(equalTo("Channel closed")));
        }
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