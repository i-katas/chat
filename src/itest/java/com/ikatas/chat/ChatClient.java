package com.ikatas.chat;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlButton;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlInput;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlTextArea;

import java.io.IOException;
import java.util.Optional;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeoutException;

import static com.gargoylesoftware.htmlunit.BrowserVersion.BEST_SUPPORTED;
import static java.lang.System.nanoTime;
import static java.util.concurrent.TimeUnit.MILLISECONDS;
import static org.apache.commons.lang3.StringUtils.trimToNull;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.fail;

public class ChatClient {
    private final String name;
    private final WebClient client = new WebClient(BEST_SUPPORTED);
    private HtmlPage ui;

    public ChatClient(String name) {
        this.name = name;
    }

    public void joinTo(ChatEndpoint chat) throws Exception {
        ui = redirectTo(chat);
        userField().type(name);
        joinButton().click();
    }

    private HtmlInput userField() throws Exception {
        return select("#user", HtmlInput.class);
    }

    private HtmlButton joinButton() throws Exception {
        return select("#join", HtmlButton.class);
    }

    private HtmlPage redirectTo(ChatEndpoint chat) throws IOException {
        HtmlPage page = client.getPage(chat.getServerLocation().toString());
        assertThat(page.getTitleText(), equalTo("Chat"));
        return page;
    }

    public synchronized void hasShownJoinedMessage() throws Exception {
        HtmlElement notice = select(".notice", HtmlElement.class);
        assertThat(await("Joined message", () -> with(trimToNull(notice.asText()))), equalTo("你已加入聊天!"));
    }

    public void hasReceivedJoinedMessageFrom(ChatClient other) throws Exception {
        HtmlElement notice = select(".other.notice", HtmlElement.class);
        assertThat(await("Joined message from " + other.name, () -> with(trimToNull(notice.asText()))), equalTo(other.name + "已加入聊天!"));
    }

    public void hasNotReceivedAnyJoinedMessages() throws Exception {
        try {
            select(".other.notice", HtmlElement.class);
            fail();
        } catch (TimeoutException expected) {/**/}
    }

    public void send(String message) throws Exception {
        select("#message", HtmlTextArea.class).type(message);
        select("#send", HtmlButton.class).click();
    }

    public void hasReceivedMessageFrom(ChatClient from, String message) throws Exception {
        HtmlElement box = select(".other.message", HtmlElement.class);
        assertThat(box.querySelector(".user").asText(), equalTo(from.name));
        assertThat(box.querySelector(".content").asText(), equalTo(message));
    }

    public void hasNoMessageReceivedFromOthers() throws Exception {
        try {
            select(".other.message", HtmlElement.class);
            fail();
        } catch (TimeoutException expected) {/**/}
    }

    private synchronized <T extends HtmlElement> T select(String selector, Class<T> type) throws Exception {
        return await(type.getSimpleName() + " is not found by " + selector, () -> with(ui.querySelector(selector)));
    }

    private <T> T await(String message, Callable<Optional<T>> probe) throws Exception {
        long timeout = MILLISECONDS.toNanos(1000), start = nanoTime();
        while (true) {
            Optional<T> value = probe.call();
            if (value != null) {
                return value.orElse(null);
            }
            if (nanoTime() - start > timeout) {
                throw new TimeoutException(message);
            }
            Thread.yield();
        }
    }

    private <T> Optional<T> with(T value) {
        return value == null ? null : Optional.ofNullable(value);
    }

    public void close() {
        client.close();
    }
}
