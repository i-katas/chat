package com.ikatas.chat;

import org.eclipse.jetty.annotations.AnnotationConfiguration;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.net.URI;
import java.net.URL;
import java.util.Properties;
import java.util.stream.Stream;

import static java.util.Collections.list;
import static java.util.stream.Collectors.joining;
import static org.eclipse.jetty.webapp.Configuration.ClassList.setServerDefault;

public class ChatWebServer implements ChatEndpoint {
    private int serverPort;
    private String contextPath;
    private String warSourceDirectory;
    private Server server;

    public ChatWebServer() {
        Properties props = loadTestEnvironment();
        serverPort = Integer.parseInt(props.getProperty("serverPort"));
        contextPath = props.getProperty("contextPath");
        warSourceDirectory = props.getProperty("warSourceDirectory");
    }

    private Properties loadTestEnvironment() {
        try (InputStream in = ClassLoader.getSystemResourceAsStream("env.properties")) {
            Properties props = new Properties();
            props.load(in);
            return props;
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

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
        WebAppContext wac = new WebAppContext(warSourceDirectory, contextPath);
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
