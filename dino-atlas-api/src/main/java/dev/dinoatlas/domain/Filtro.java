package dev.dinoatlas.domain;

import java.util.function.Predicate;

public record Filtro(Periodo periodo, Dieta dieta, Grupo grupo) implements Predicate<Ocorrencia> {

    public static final Filtro TODOS = new Filtro(null, null, null);

    @Override
    public boolean test(Ocorrencia o) {
        return (periodo == null || o.periodo() == periodo)
                && (dieta == null || o.dieta() == dieta)
                && (grupo == null || o.grupo() == grupo);
    }
}
