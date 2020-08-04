package com.ikatas.chat;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class ChatTest {
    private final ChatWebServer chat = new ChatWebServer();
    private final ChatClient bob = new ChatClient("bob");
    private final ChatClient jack = new ChatClient("jack");

    @Before
    public void startChat() throws Exception {
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

    @After
    public void stop() throws Exception {
        jack.close();
        bob.close();
        chat.stop();
    }
}
