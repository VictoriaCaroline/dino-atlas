package dev.dinoatlas.domain;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AgregadorTest {

    private static Ocorrencia oc(long id, String genero, Grupo g, Dieta d, double ma, String cc) {
        String nome = genero == null ? "Hadrosauridae" : genero;
        return new Ocorrencia(id, genero, nome, g, d, Periodo.deIdade(ma), ma, cc, 0, 0);
    }

    private final List<Ocorrencia> base = List.of(
            oc(1, "Tyrannosaurus", Grupo.THEROPODA, Dieta.CARNIVORO, 67, "US"),
            oc(2, "Tyrannosaurus", Grupo.THEROPODA, Dieta.CARNIVORO, 67, "US"),
            oc(3, "Triceratops", Grupo.ORNITHISCHIA, Dieta.HERBIVORO, 67, "US"),
            oc(4, "Staurikosaurus", Grupo.THEROPODA, Dieta.CARNIVORO, 233, "BR"),
            oc(5, "Plateosaurus", Grupo.SAUROPODOMORPHA, Dieta.HERBIVORO, 210, "DE"),
            oc(6, null, Grupo.ORNITHISCHIA, Dieta.DESCONHECIDA, 75, "CA"),
            oc(7, "Raphus", Grupo.AVES, Dieta.HERBIVORO, 0.01, "MU"));

    @Test
    void classificaPeriodoPelaIdade() {
        assertEquals(Periodo.TRIASSICO, Periodo.deIdade(233));
        assertEquals(Periodo.JURASSICO, Periodo.deIdade(150));
        assertEquals(Periodo.CRETACEO, Periodo.deIdade(66.5));
        assertEquals(Periodo.PALEOGENO, Periodo.deIdade(50));
        assertEquals(Periodo.NEOGENO, Periodo.deIdade(10));
        assertEquals(Periodo.QUATERNARIO, Periodo.deIdade(0));
        assertNull(Periodo.deIdade(260));
    }

    @Test
    void normalizaDietaDoPbdb() {
        assertEquals(Dieta.CARNIVORO, Dieta.doPbdb("piscivore"));
        assertEquals(Dieta.HERBIVORO, Dieta.doPbdb("browser, grazer"));
        assertEquals(Dieta.ONIVORO, Dieta.doPbdb("omnivore"));
        assertEquals(Dieta.DESCONHECIDA, Dieta.doPbdb(null));
    }

    @Test
    void indeterminadoContaOcorrenciaMasNaoGenero() {
        var r = Agregador.resumo(base);
        assertEquals(7, r.ocorrencias());
        assertEquals(5, r.generos());
        assertEquals(5, r.paises());
    }

    @Test
    void dietaSomaCemPorCento() {
        var fatias = Agregador.porDieta(base);
        assertEquals(100.0, fatias.stream().mapToDouble(Agregador.Fatia::percentual).sum(), 0.2);
    }

    @Test
    void topPaisesOrdenado() {
        var top = Agregador.topPaises(base, 2);
        assertEquals("US", top.get(0).codigo());
        assertEquals(3, top.get(0).total());
        assertEquals(2, top.size());
    }

    @Test
    void diversidadeIgnoraIndeterminadoEChegaAoPresente() {
        var faixas = Agregador.diversidade(base, 10);
        assertEquals(240, faixas.get(0).inicioMa());
        var ultima = faixas.get(faixas.size() - 1);
        assertEquals(10, ultima.inicioMa());
        assertEquals(1, ultima.generos());
        assertTrue(faixas.stream().noneMatch(f -> f.inicioMa() == 80));
    }

    @Test
    void pontoUsaNomeQuandoNaoHaGenero() {
        var p = Agregador.pontos(base).stream().filter(x -> x.id() == 6).findFirst().orElseThrow();
        assertNull(p.genero());
        assertEquals("Hadrosauridae", p.nome());
    }

    @Test
    void filtroCombinado() {
        var f = new Filtro(Periodo.CRETACEO, Dieta.CARNIVORO, null);
        assertEquals(2, base.stream().filter(f).count());
    }
}
