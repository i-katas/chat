package com.ikatas.chat;

import org.json.JSONObject;

import javax.websocket.RemoteEndpoint;
import java.util.function.Consumer;

import static java.util.Objects.requireNonNull;
import static org.json.JSONObject.valueToString;

class ChatMessageDispatcher implements ChatMessageListener {
    private static final Consumer<Throwable> IGNORING_HANDLER = ignored -> {/**/};
    private final RemoteEndpoint.Basic endpoint;
    private final Consumer<? super Throwable> errorHandler;

    public ChatMessageDispatcher(RemoteEndpoint.Basic endpoint, Consumer<? super Throwable> errorHandler) {
        this.endpoint = requireNonNull(endpoint);
        this.errorHandler = errorHandler == null ? IGNORING_HANDLER : errorHandler;
    }

    @Override
    public void userJoined(String user) {
        dispatch(user);
    }

    @Override
    public void messageReceived(String user, String message) {
        dispatch(messageFrom(user, message));
    }

    private JSONObject messageFrom(String user, String message) {
        return new JSONObject().put("from", user).put("content", message);
    }

    private void dispatch(Object value) {
        try {
            endpoint.sendText(valueToString(value));
        } catch (Throwable e) {
            errorHandler.accept(e);
        }
    }
}
