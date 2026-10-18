package dev.dinoatlas.wiki;

import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

class VerbeteResolverTest {

    private static Verbete artigo(String idioma, String titulo) {
        return new Verbete(idioma, titulo, "resumo", null, "https://" + idioma + ".wikipedia.org/wiki/" + titulo);
    }

    @Test
    void prefereVerbeteEmPortugues() {
        var r = new VerbeteResolver((idioma, t) -> Optional.of(artigo(idioma, t)));
        assertEquals("pt", r.resolver("Tyrannosaurus").fonte());
    }

    @Test
    void caiParaInglesQuandoNaoHaEmPortugues() {
        var r = new VerbeteResolver((idioma, t) -> idioma.equals("en") ? Optional.of(artigo(idioma, t)) : Optional.empty());
        assertEquals("en", r.resolver("Macheiramphus").fonte());
    }

    @Test
    void caiParaPbdbQuandoNaoHaArtigo() {
        var r = new VerbeteResolver((idioma, t) -> Optional.empty());
        Verbete v = r.resolver("Macheiramphus");
        assertEquals("pbdb", v.fonte());
        assertTrue(v.url().endsWith("taxon_name=Macheiramphus"));
        assertNull(v.resumo());
    }

    @Test
    void cacheEvitaNovaConsulta() {
        var chamadas = new AtomicInteger();
        var r = new VerbeteResolver((idioma, t) -> {
            chamadas.incrementAndGet();
            return Optional.of(artigo(idioma, t));
        });
        r.resolver("Triceratops");
        r.resolver("Triceratops");
        assertEquals(1, chamadas.get());
    }

    @Test
    void falhaDeRedeNaoFicaEmCache() {
        var chamadas = new AtomicInteger();
        var r = new VerbeteResolver((idioma, t) -> {
            chamadas.incrementAndGet();
            throw new IllegalStateException("timeout");
        });
        assertEquals("pbdb", r.resolver("Iguanodon").fonte());
        r.resolver("Iguanodon");
        assertEquals(4, chamadas.get());
    }
}
