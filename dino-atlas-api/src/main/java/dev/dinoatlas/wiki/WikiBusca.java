package dev.dinoatlas.wiki;

import java.util.Optional;

@FunctionalInterface
public interface WikiBusca {

    /**
     * @return vazio se o artigo não existir nesse idioma
     * @throws RuntimeException em falha de rede ou resposta inesperada (não é "artigo inexistente")
     */
    Optional<Verbete> buscar(String idioma, String titulo);
}
