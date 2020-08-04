package com.ikatas.chat;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class ChatTest {
    private final ChatWebServer chat = new ChatWebServer();
    private final ChatClient bob = new ChatClient("bob");

    @Before
    public void startChat() throws Exception {
        chat.start();
    }

    @Test
    public void showsJoinedMessageWhenJoinChatSuccess() throws Exception {
        bob.joinTo(chat);

        bob.hasShownJoinedMessage();
    }

    @After
    public void stop() throws Exception {
        bob.close();
        chat.stop();
    }
}
