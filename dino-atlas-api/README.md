# Dino Atlas API

Back-end do Atlas Mesozoico. Baixa **todas** as ocorrências de Dinosauria do [Paleobiology Database](https://paleobiodb.org), do Triássico ao Quaternário, aves incluídas, guarda em memória e entrega agregados prontos para os painéis.

Fósseis sem gênero identificado (ex.: "Hadrosauridae indet.") entram nas contagens e no mapa com o nome do táxon mais fino disponível, mas ficam fora da contagem de gêneros e da curva de diversidade.

Java 21 · Spring Boot 3.3

## Rodar

```bash
mvn spring-boot:run
```

A primeira subida baixa tudo do PBDB. Com as aves, isso pode levar bem mais que alguns minutos e grava `data/pbdb-cache.json`. As próximas leem o snapshot. Ele é renovado toda segunda às 4h ou quando passa de 7 dias.

## Endpoints

Filtros opcionais: `periodo` (`TRIASSICO`, `JURASSICO`, `CRETACEO`, `PALEOGENO`, `NEOGENO`, `QUATERNARIO`), `dieta` (`CARNIVORO`, `HERBIVORO`, `ONIVORO`, `DESCONHECIDA`), `grupo` (`THEROPODA`, `AVES`, `SAUROPODOMORPHA`, `ORNITHISCHIA`, `OUTROS`).

`THEROPODA` exclui as aves e `OUTROS` reúne formas basais e material só identificado como Dinosauria ou Saurischia, então nenhum registro é contado duas vezes.

| Endpoint | Painel |
|---|---|
| `GET /api/resumo` | KPIs do topo |
| `GET /api/dieta` | Barras de HP de dieta |
| `GET /api/grupos` | Party (composição por grupo) |
| `GET /api/paises?top=8` | High Score |
| `GET /api/diversidade?faixa=10` | Timeline |
| `GET /api/ocorrencias` | World Map |
| `GET /api/generos/{nome}` | Quest Log |

Enquanto o primeiro download não termina, os endpoints respondem `503`.

## Estrutura

```
domain/   regras puras: período, dieta, grupo, Agregador (sem Spring)
pbdb/     cliente HTTP do PBDB
repo/     cache em memória + snapshot em disco
service/  aplica filtros e chama o Agregador
web/      controller REST
```
