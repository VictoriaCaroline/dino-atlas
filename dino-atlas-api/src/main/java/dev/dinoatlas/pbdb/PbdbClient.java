package dev.dinoatlas.pbdb;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import dev.dinoatlas.config.AtlasProperties;
import dev.dinoatlas.domain.Grupo;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class PbdbClient {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OcorrenciaPbdb(
            @JsonProperty("occurrence_no") Long id,
            String genus,
            @JsonProperty("accepted_name") String nomeAceito,
            @JsonProperty("identified_name") String nomeIdentificado,
            Double lat,
            Double lng,
            String cc,
            @JsonProperty("max_ma") Double maxMa,
            @JsonProperty("min_ma") Double minMa) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TaxonPbdb(@JsonProperty("taxon_name") String nome, String diet) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Resposta<T>(List<T> records) {}

    private final RestClient http;

    public PbdbClient(AtlasProperties props) {
        var fabrica = new SimpleClientHttpRequestFactory();
        fabrica.setConnectTimeout(15_000);
        fabrica.setReadTimeout(props.pbdb().timeoutSeconds() * 1000);
        this.http = RestClient.builder()
                .baseUrl(props.pbdb().baseUrl())
                .requestFactory(fabrica)
                .build();
    }

    public List<OcorrenciaPbdb> ocorrencias(Grupo grupo) {
        Resposta<OcorrenciaPbdb> r = http.get()
                .uri(u -> u.path("/occs/list.json")
                        .queryParam("base_name", grupo.filtroPbdb())
                        .queryParam("show", "coords,loc,class")
                        .queryParam("vocab", "pbdb")
                        .queryParam("limit", "all")
                        .build())
                .retrieve()
                .body(new org.springframework.core.ParameterizedTypeReference<Resposta<OcorrenciaPbdb>>() {});
        return r == null || r.records() == null ? List.of() : r.records();
    }

    public List<TaxonPbdb> dietasPorGenero() {
        Resposta<TaxonPbdb> r = http.get()
                .uri(u -> u.path("/taxa/list.json")
                        .queryParam("base_name", "Dinosauria")
                        .queryParam("rank", "genus")
                        .queryParam("show", "ecospace")
                        .queryParam("vocab", "pbdb")
                        .queryParam("limit", "all")
                        .build())
                .retrieve()
                .body(new org.springframework.core.ParameterizedTypeReference<Resposta<TaxonPbdb>>() {});
        return r == null || r.records() == null ? List.of() : r.records();
    }
}
