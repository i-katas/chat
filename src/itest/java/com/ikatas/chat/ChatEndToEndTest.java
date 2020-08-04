package com.ikatas.chat;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class ChatEndToEndTest {
    private final ChatWebServer chat = new ChatWebServer();
    private final ChatClient bob = new ChatClient("bob");
    private final ChatClient jack = new ChatClient("jack");

    @Before
    public void setUp() throws Exception {
        chat.start();
    }

    @Test
    public void showsJoinedMessageWhenJoinChatSuccess() throws Exception {
        bob.joinTo(chat);

        bob.hasShownJoinedMessage();
    }

    @Test
    public void receivesJoinMessageFromOthersAfterJoinedToChat() throws Exception {
        bob.joinTo(chat);
        bob.hasShownJoinedMessage();

        jack.joinTo(chat);
        jack.hasShownJoinedMessage();

        bob.hasReceivedJoinedMessageFrom(jack);
        jack.hasNotReceivedAnyJoinedMessages();
    }

    @Test
    public void receivesMessageFromOthers() throws Exception {
        bob.joinTo(chat);
        jack.joinTo(chat);

        bob.send("hello");

        jack.hasReceivedMessageFrom(bob, "hello");
        bob.hasNoMessageReceivedFromOthers();
    }

    @After
    public void tearDown() throws Exception {
        jack.close();
        bob.close();
        chat.stop();
    }
}
