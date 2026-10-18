package dev.dinoatlas.repo;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.dinoatlas.config.AtlasProperties;
import dev.dinoatlas.domain.*;
import dev.dinoatlas.pbdb.PbdbClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

/**
 * Dados em memória. O PBDB muda pouco, então baixa uma vez,
 * grava um snapshot em disco e só atualiza quando ele envelhece.
 */
@Repository
public class OcorrenciaRepository {

    private static final Logger log = LoggerFactory.getLogger(OcorrenciaRepository.class);

    private final PbdbClient pbdb;
    private final ObjectMapper json;
    private final Path arquivo;
    private final Duration maxIdade;

    private volatile List<Ocorrencia> dados = List.of();

    public OcorrenciaRepository(PbdbClient pbdb, ObjectMapper json, AtlasProperties props) {
        this.pbdb = pbdb;
        this.json = json;
        this.arquivo = Path.of(props.cache().arquivo());
        this.maxIdade = Duration.ofDays(props.cache().maxIdadeDias());
    }

    public List<Ocorrencia> todas() {
        return dados;
    }

    public boolean pronto() {
        return !dados.isEmpty();
    }

    @EventListener(ApplicationReadyEvent.class)
    public void carregar() {
        if (snapshotValido() && lerSnapshot()) {
            return;
        }
        atualizar();
    }

    @Scheduled(cron = "0 0 4 * * MON")
    public void atualizar() {
        try {
            List<Ocorrencia> novos = baixar();
            if (novos.isEmpty()) {
                throw new IllegalStateException("PBDB devolveu zero registros");
            }
            dados = List.copyOf(novos);
            gravarSnapshot();
            log.info("PBDB carregado: {} ocorrências", dados.size());
        } catch (Exception e) {
            log.error("Falha ao baixar do PBDB: {}", e.getMessage());
            if (dados.isEmpty()) {
                lerSnapshot();
            }
        }
    }

    private List<Ocorrencia> baixar() {
        Map<String, Dieta> dietas = new HashMap<>();
        for (PbdbClient.TaxonPbdb t : pbdb.dietasPorGenero()) {
            dietas.put(t.nome(), Dieta.doPbdb(t.diet()));
        }

        List<Ocorrencia> lista = new ArrayList<>();
        for (Grupo grupo : Grupo.values()) {
            List<PbdbClient.OcorrenciaPbdb> recebidas = pbdb.ocorrencias(grupo);
            int antes = lista.size();
            for (PbdbClient.OcorrenciaPbdb o : recebidas) {
                if (o.lat() == null || o.lng() == null || o.maxMa() == null || o.minMa() == null) {
                    continue;
                }
                double idade = (o.maxMa() + o.minMa()) / 2;
                Periodo periodo = Periodo.deIdade(idade);
                if (periodo == null) {
                    continue;
                }
                String genero = o.genus() == null || o.genus().isBlank() ? null : o.genus();
                String nome = Objects.requireNonNullElse(o.nomeAceito(),
                        Objects.requireNonNullElse(o.nomeIdentificado(), "Indeterminado"));
                Dieta dieta = genero == null ? Dieta.DESCONHECIDA : dietas.getOrDefault(genero, Dieta.DESCONHECIDA);
                lista.add(new Ocorrencia(o.id(), genero, nome, grupo, dieta, periodo, idade, o.cc(), o.lat(), o.lng()));
            }
            log.info("{}: {} recebidas, {} aproveitadas", grupo, recebidas.size(), lista.size() - antes);
        }
        return lista;
    }

    private boolean snapshotValido() {
        try {
            return Files.exists(arquivo)
                    && Files.getLastModifiedTime(arquivo).toInstant().isAfter(Instant.now().minus(maxIdade));
        } catch (IOException e) {
            return false;
        }
    }

    private boolean lerSnapshot() {
        if (!Files.exists(arquivo)) {
            return false;
        }
        try {
            dados = List.copyOf(json.readValue(arquivo.toFile(), new TypeReference<List<Ocorrencia>>() {}));
            log.info("Snapshot carregado: {} ocorrências", dados.size());
            return true;
        } catch (IOException e) {
            log.warn("Snapshot ilegível: {}", e.getMessage());
            return false;
        }
    }

    private void gravarSnapshot() {
        try {
            Files.createDirectories(arquivo.toAbsolutePath().getParent());
            json.writeValue(arquivo.toFile(), dados);
        } catch (IOException e) {
            log.warn("Não gravou o snapshot: {}", e.getMessage());
        }
    }
}
