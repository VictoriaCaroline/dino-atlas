package dev.dinoatlas.wiki;

/**
 * @param fonte  "pt", "en" ou "pbdb"
 * @param resumo primeiro parágrafo do artigo; null quando a fonte é o PBDB
 * @param imagem miniatura do artigo; null quando não houver
 */
public record Verbete(String fonte, String titulo, String resumo, String imagem, String url) {}
