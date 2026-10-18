package dev.dinoatlas.domain;

import java.util.Locale;

public enum Dieta {
    CARNIVORO("Carnívoro"),
    HERBIVORO("Herbívoro"),
    ONIVORO("Onívoro"),
    DESCONHECIDA("Desconhecida");

    private final String nome;

    Dieta(String nome) {
        this.nome = nome;
    }

    public String nome() {
        return nome;
    }

    /** O PBDB usa um vocabulário amplo (piscivore, browser, grazer...). Aqui vira 3 grupos. */
    public static Dieta doPbdb(String valor) {
        if (valor == null || valor.isBlank()) {
            return DESCONHECIDA;
        }
        String v = valor.toLowerCase(Locale.ROOT);
        if (v.contains("omnivore")) return ONIVORO;
        if (v.contains("carnivore") || v.contains("piscivore") || v.contains("insectivore")) return CARNIVORO;
        if (v.contains("herbivore") || v.contains("browser") || v.contains("grazer") || v.contains("frugivore")) return HERBIVORO;
        return DESCONHECIDA;
    }
}
