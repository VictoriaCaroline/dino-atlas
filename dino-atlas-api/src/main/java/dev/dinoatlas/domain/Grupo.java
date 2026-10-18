package dev.dinoatlas.domain;

public enum Grupo {
    THEROPODA("Terópodes", "Theropoda^Aves"),
    AVES("Aves", "Aves"),
    SAUROPODOMORPHA("Sauropodomorfos", "Sauropodomorpha"),
    ORNITHISCHIA("Ornitísquios", "Ornithischia"),
    OUTROS("Outros", "Dinosauria^Theropoda^Sauropodomorpha^Ornithischia");

    private final String nome;
    private final String filtroPbdb;

    Grupo(String nome, String filtroPbdb) {
        this.nome = nome;
        this.filtroPbdb = filtroPbdb;
    }

    public String nome() {
        return nome;
    }

    /**
     * Valor do parâmetro base_name. As exclusões (^) evitam contar o mesmo registro duas vezes:
     * aves saem dos terópodes, e OUTROS pega o que sobra de Dinosauria (formas basais e indeterminados).
     */
    public String filtroPbdb() {
        return filtroPbdb;
    }
}
