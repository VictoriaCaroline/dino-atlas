package dev.dinoatlas.domain;

/**
 * @param genero null quando o fóssil não foi identificado até gênero
 * @param nome   nome aceito no PBDB no nível mais fino disponível (ex.: "Hadrosauridae")
 */
public record Ocorrencia(
        long id,
        String genero,
        String nome,
        Grupo grupo,
        Dieta dieta,
        Periodo periodo,
        double idadeMa,
        String paisCodigo,
        double lat,
        double lng
) {
    public boolean temGenero() {
        return genero != null;
    }
}
