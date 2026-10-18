package dev.dinoatlas.wiki;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Optional;

/** API REST de resumos da Wikipédia: /api/rest_v1/page/summary/{titulo}. */
@Component
public class WikiClient implements WikiBusca {

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Resumo(String title, String type, String extract, Imagem thumbnail,
                  @JsonProperty("content_urls") Urls urls) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Imagem(String source) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Urls(Pagina desktop) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Pagina(String page) {}

    private final RestClient http;

    public WikiClient() {
        var fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(5_000);
        fabrica.setReadTimeout(8_000);
        this.http = RestClient.builder()
                .requestFactory(fabrica)
                // A Wikimedia pede um User-Agent que identifique a aplicação
                .defaultHeader("User-Agent", "DinoAtlas/0.1 (projeto de portfolio; github.com/VictoriaCaroline/dino-atlas)")
                .build();
    }

    @Override
    public Optional<Verbete> buscar(String idioma, String titulo) {
        return http.get()
                .uri("https://{idioma}.wikipedia.org/api/rest_v1/page/summary/{titulo}", idioma, titulo)
                .exchange((req, resp) -> {
                    int status = resp.getStatusCode().value();
                    if (status == 404) {
                        return Optional.empty();
                    }
                    if (status != 200) {
                        throw new IllegalStateException("Wikipédia " + idioma + " respondeu " + status);
                    }
                    Resumo r = resp.bodyTo(Resumo.class);
                    // Página de desambiguação não descreve o gênero; conta como inexistente
                    if (r == null || !"standard".equals(r.type())) {
                        return Optional.empty();
                    }
                    String imagem = r.thumbnail() == null ? null : r.thumbnail().source();
                    String url = r.urls() == null || r.urls().desktop() == null
                            ? "https://" + idioma + ".wikipedia.org/wiki/" + titulo
                            : r.urls().desktop().page();
                    return Optional.of(new Verbete(idioma, r.title(), r.extract(), imagem, url));
                });
    }
}
