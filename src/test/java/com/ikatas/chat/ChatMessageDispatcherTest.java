package com.ikatas.chat;

import org.junit.Test;

import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;

import static java.lang.ClassLoader.getSystemClassLoader;
import static java.lang.reflect.Proxy.newProxyInstance;
import static javax.websocket.RemoteEndpoint.Basic;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class ChatMessageDispatcherTest {

    @Test
    public void reportsErrorWhenSendingMessageFailed() {
        AtomicReference<Throwable> captured = new AtomicReference<>();
        IllegalStateException error = new IllegalStateException("crashed");

        failsWith(error, captured::set).userJoined("user");

        assertThat(captured.get(), equalTo(error));
    }

    @Test
    public void ignoringErrorsIfNoErrorHandlerConfigured() {
        failsWith(new IllegalStateException("crashed"), null).userJoined("user");
    }

    private ChatMessageDispatcher failsWith(Exception error, Consumer<Throwable> errorHandler) {
        return new ChatMessageDispatcher(failsWith(error), errorHandler);
    }

    private Basic failsWith(Exception exception) {
        return (Basic) newProxyInstance(getSystemClassLoader(), new Class[]{Basic.class}, (proxy, method, args) -> {
            throw exception;
        });
    }
}