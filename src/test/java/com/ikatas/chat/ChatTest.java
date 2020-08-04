package com.ikatas.chat;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

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

    private static class MockChatListener implements ChatListener {
        private final List<String> joinedUsers = new ArrayList<>();

        public void hasNoJoinedMessageReceived() {
            assertThat(joinedUsers, is(empty()));
        }

        public void hasReceivedJoinedMessageFrom(String user) {
            assertThat(joinedUsers, hasItem(user));
        }

        @Override
        public void userJoined(String user) {
            joinedUsers.add(user);
        }
    }
}