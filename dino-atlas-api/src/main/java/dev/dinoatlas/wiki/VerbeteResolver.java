package dev.dinoatlas.wiki;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Escolhe o melhor verbete para um gênero: Wikipédia em português, depois em inglês,
 * e por último a página do táxon no PBDB, que sempre existe.
 * Só guarda em cache resultados definitivos; falha de rede tenta de novo na próxima chamada.
 */
public class VerbeteResolver {

    private static final List<String> IDIOMAS = List.of("pt", "en");

    private final WikiBusca wiki;
    private final Map<String, Verbete> cache = new ConcurrentHashMap<>();

    public VerbeteResolver(WikiBusca wiki) {
        this.wiki = wiki;
    }

    public Verbete resolver(String genero) {
        Verbete pronto = cache.get(genero);
        if (pronto != null) {
            return pronto;
        }

        boolean houveFalha = false;
        for (String idioma : IDIOMAS) {
            try {
                Optional<Verbete> v = wiki.buscar(idioma, genero);
                if (v.isPresent()) {
                    cache.put(genero, v.get());
                    return v.get();
                }
            } catch (RuntimeException e) {
                houveFalha = true;
            }
        }

        Verbete pbdb = paginaPbdb(genero);
        if (!houveFalha) {
            cache.put(genero, pbdb);
        }
        return pbdb;
    }

    static Verbete paginaPbdb(String genero) {
        String url = "https://paleobiodb.org/classic/checkTaxonInfo?taxon_name="
                + URLEncoder.encode(genero, StandardCharsets.UTF_8);
        return new Verbete("pbdb", genero, null, null, url);
    }
}
