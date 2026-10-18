package dev.dinoatlas.domain;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Cálculos dos painéis. Sem Spring, para testar isolado. */
public final class Agregador {

    public record Resumo(long ocorrencias, long generos, long paises, double idadeMaxMa, double idadeMinMa) {}

    public record Fatia(String chave, String nome, long total, double percentual) {}

    public record PaisTotal(String codigo, String nome, long total) {}

    public record FaixaTempo(int inicioMa, int fimMa, long generos) {}

    public record Ponto(long id, String genero, String nome, double lat, double lng, String periodo, String grupo) {}

    private static final Locale PT_BR = Locale.of("pt", "BR");

    private Agregador() {}

    public static Resumo resumo(List<Ocorrencia> lista) {
        DoubleSummaryStatistics idades = lista.stream().mapToDouble(Ocorrencia::idadeMa).summaryStatistics();
        return new Resumo(
                lista.size(),
                lista.stream().filter(Ocorrencia::temGenero).map(Ocorrencia::genero).distinct().count(),
                lista.stream().map(Ocorrencia::paisCodigo).filter(Objects::nonNull).distinct().count(),
                lista.isEmpty() ? 0 : arred(idades.getMax()),
                lista.isEmpty() ? 0 : arred(idades.getMin()));
    }

    public static List<Fatia> porDieta(List<Ocorrencia> lista) {
        return fatias(lista, Ocorrencia::dieta, Dieta.values(), Dieta::nome);
    }

    public static List<Fatia> porGrupo(List<Ocorrencia> lista) {
        return fatias(lista, Ocorrencia::grupo, Grupo.values(), Grupo::nome);
    }

    public static List<PaisTotal> topPaises(List<Ocorrencia> lista, int limite) {
        return lista.stream()
                .filter(o -> o.paisCodigo() != null)
                .collect(Collectors.groupingBy(Ocorrencia::paisCodigo, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limite)
                .map(e -> new PaisTotal(e.getKey(), nomePais(e.getKey()), e.getValue()))
                .toList();
    }

    /** Gêneros distintos por faixa, do mais antigo para o mais recente. */
    public static List<FaixaTempo> diversidade(List<Ocorrencia> lista, int tamanhoFaixaMa) {
        Map<Integer, Set<String>> porFaixa = new TreeMap<>(Comparator.reverseOrder());
        for (Ocorrencia o : lista) {
            if (!o.temGenero()) {
                continue;
            }
            int inicio = Math.max(tamanhoFaixaMa, (int) Math.ceil(o.idadeMa() / tamanhoFaixaMa) * tamanhoFaixaMa);
            porFaixa.computeIfAbsent(inicio, k -> new HashSet<>()).add(o.genero());
        }
        return porFaixa.entrySet().stream()
                .map(e -> new FaixaTempo(e.getKey(), e.getKey() - tamanhoFaixaMa, e.getValue().size()))
                .toList();
    }

    public static List<Ponto> pontos(List<Ocorrencia> lista) {
        return lista.stream()
                .map(o -> new Ponto(o.id(), o.genero(), o.nome(), o.lat(), o.lng(), o.periodo().nome(), o.grupo().nome()))
                .toList();
    }

    public static String nomePais(String codigo) {
        String nome = Locale.of("", codigo).getDisplayCountry(PT_BR);
        return nome.isBlank() || nome.equalsIgnoreCase(codigo) ? codigo : nome;
    }

    private static <E extends Enum<E>> List<Fatia> fatias(List<Ocorrencia> lista, Function<Ocorrencia, E> chave,
                                                         E[] valores, Function<E, String> nome) {
        Map<E, Long> contagem = lista.stream().collect(Collectors.groupingBy(chave, Collectors.counting()));
        long total = lista.size();
        return Arrays.stream(valores)
                .filter(contagem::containsKey)
                .map(v -> new Fatia(v.name(), nome.apply(v), contagem.get(v),
                        total == 0 ? 0 : arred(contagem.get(v) * 100.0 / total)))
                .toList();
    }

    private static double arred(double v) {
        return Math.round(v * 10) / 10.0;
    }
}
