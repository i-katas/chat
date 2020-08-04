package com.ikatas.chat;

import org.eclipse.jetty.annotations.AnnotationConfiguration;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.util.stream.Stream;

import static java.util.Collections.list;
import static java.util.stream.Collectors.joining;
import static org.eclipse.jetty.webapp.Configuration.ClassList.setServerDefault;

public class ChatWebServer implements ChatEndpoint {
    private static final String WEB_ROOT_DIR = "src/main/webapp";
    private final int serverPort = 8080;
    private final String contextPath = "/chat";
    private Server server;

    public void start() throws Exception {
        server = serverScanAnnotations(serverPort);
        server.setHandler(webapp(contextPath));
        server.setStopAtShutdown(true);
        server.start();
    }

    private Server serverScanAnnotations(int serverPort) {
        Server server = new Server(serverPort);
        setServerDefault(server).add(AnnotationConfiguration.class.getName());
        return server;
    }

    private WebAppContext webapp(String contextPath) throws IOException {
        WebAppContext wac = new WebAppContext(WEB_ROOT_DIR, contextPath);
        wac.setExtraClasspath(buildOutputDirs().collect(joining(";")));
        return wac;
    }

    private Stream<String> buildOutputDirs() throws IOException {
        return list(ClassLoader.getSystemResources("")).stream().map(URL::toString);
    }

    @Override
    public URI getServerLocation() {
        return URI.create(String.format("http://localhost:%d%s", serverPort, contextPath));
    }

    public void stop() throws Exception {
        if (server != null) {
            server.stop();
        }
    }
}
