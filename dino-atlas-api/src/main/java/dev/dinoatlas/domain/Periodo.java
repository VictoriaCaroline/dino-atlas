package dev.dinoatlas.domain;

public enum Periodo {
    TRIASSICO("Triássico", 251.9, 201.4),
    JURASSICO("Jurássico", 201.4, 145.0),
    CRETACEO("Cretáceo", 145.0, 66.0),
    PALEOGENO("Paleógeno", 66.0, 23.03),
    NEOGENO("Neógeno", 23.03, 2.58),
    QUATERNARIO("Quaternário", 2.58, 0.0);

    private final String nome;
    private final double inicioMa;
    private final double fimMa;

    Periodo(String nome, double inicioMa, double fimMa) {
        this.nome = nome;
        this.inicioMa = inicioMa;
        this.fimMa = fimMa;
    }

    public String nome() {
        return nome;
    }

    /** Classifica pela idade média do intervalo; null se for anterior ao Triássico. */
    public static Periodo deIdade(double idadeMa) {
        for (Periodo p : values()) {
            boolean dentro = idadeMa <= p.inicioMa && (idadeMa > p.fimMa || (p.fimMa == 0 && idadeMa >= 0));
            if (dentro) {
                return p;
            }
        }
        return null;
    }
}
