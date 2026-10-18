package dev.dinoatlas.service;

import dev.dinoatlas.domain.Agregador;
import dev.dinoatlas.domain.Filtro;
import dev.dinoatlas.domain.Ocorrencia;
import dev.dinoatlas.repo.OcorrenciaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class AtlasService {

    public record FichaGenero(String genero, String grupo, String dieta, String periodo,
                              double idadeMaxMa, double idadeMinMa, long ocorrencias,
                              List<Agregador.PaisTotal> paises, String wikipedia) {}

    private final OcorrenciaRepository repo;

    public AtlasService(OcorrenciaRepository repo) {
        this.repo = repo;
    }

    public Agregador.Resumo resumo(Filtro f) {
        return Agregador.resumo(filtrar(f));
    }

    public List<Agregador.Fatia> dieta(Filtro f) {
        return Agregador.porDieta(filtrar(f));
    }

    public List<Agregador.Fatia> grupos(Filtro f) {
        return Agregador.porGrupo(filtrar(f));
    }

    public List<Agregador.PaisTotal> paises(Filtro f, int top) {
        return Agregador.topPaises(filtrar(f), top);
    }

    public List<Agregador.FaixaTempo> diversidade(Filtro f, int faixaMa) {
        return Agregador.diversidade(filtrar(f), faixaMa);
    }

    public List<Agregador.Ponto> pontos(Filtro f) {
        return Agregador.pontos(filtrar(f));
    }

    public FichaGenero ficha(String genero) {
        List<Ocorrencia> lista = filtrar(Filtro.TODOS).stream()
                .filter(o -> o.temGenero() && o.genero().equalsIgnoreCase(genero))
                .toList();
        if (lista.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Gênero não encontrado: " + genero);
        }
        Ocorrencia ref = lista.stream().min(Comparator.comparingDouble(Ocorrencia::idadeMa)).orElseThrow();
        var resumo = Agregador.resumo(lista);
        return new FichaGenero(ref.genero(), ref.grupo().nome(), ref.dieta().nome(), ref.periodo().nome(),
                resumo.idadeMaxMa(), resumo.idadeMinMa(), lista.size(),
                Agregador.topPaises(lista, 5),
                "https://pt.wikipedia.org/wiki/" + ref.genero());
    }

    private List<Ocorrencia> filtrar(Filtro f) {
        if (!repo.pronto()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Dados ainda carregando do PBDB");
        }
        return repo.todas().stream().filter(f).toList();
    }
}
