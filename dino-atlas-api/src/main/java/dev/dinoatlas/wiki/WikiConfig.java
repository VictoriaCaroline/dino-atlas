package dev.dinoatlas.wiki;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WikiConfig {

    @Bean
    public VerbeteResolver verbeteResolver(WikiBusca wiki) {
        return new VerbeteResolver(wiki);
    }
}
