package dev.dinoatlas.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "atlas")
public record AtlasProperties(Pbdb pbdb, Cache cache, Cors cors) {

    public record Pbdb(String baseUrl, int timeoutSeconds) {}

    public record Cache(String arquivo, int maxIdadeDias) {}

    public record Cors(List<String> origens) {}
}
