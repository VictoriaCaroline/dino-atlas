package dev.dinoatlas.web;

import dev.dinoatlas.domain.*;
import dev.dinoatlas.service.AtlasService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AtlasController {

    private final AtlasService atlas;

    public AtlasController(AtlasService atlas) {
        this.atlas = atlas;
    }

    @GetMapping("/resumo")
    public Agregador.Resumo resumo(@RequestParam(required = false) Periodo periodo,
                                   @RequestParam(required = false) Dieta dieta,
                                   @RequestParam(required = false) Grupo grupo) {
        return atlas.resumo(new Filtro(periodo, dieta, grupo));
    }

    @GetMapping("/dieta")
    public List<Agregador.Fatia> dieta(@RequestParam(required = false) Periodo periodo,
                                       @RequestParam(required = false) Grupo grupo) {
        return atlas.dieta(new Filtro(periodo, null, grupo));
    }

    @GetMapping("/grupos")
    public List<Agregador.Fatia> grupos(@RequestParam(required = false) Periodo periodo,
                                        @RequestParam(required = false) Dieta dieta) {
        return atlas.grupos(new Filtro(periodo, dieta, null));
    }

    @GetMapping("/paises")
    public List<Agregador.PaisTotal> paises(@RequestParam(required = false) Periodo periodo,
                                            @RequestParam(required = false) Dieta dieta,
                                            @RequestParam(required = false) Grupo grupo,
                                            @RequestParam(defaultValue = "8") int top) {
        return atlas.paises(new Filtro(periodo, dieta, grupo), Math.clamp(top, 1, 50));
    }

    @GetMapping("/diversidade")
    public List<Agregador.FaixaTempo> diversidade(@RequestParam(required = false) Dieta dieta,
                                                  @RequestParam(required = false) Grupo grupo,
                                                  @RequestParam(defaultValue = "10") int faixa) {
        return atlas.diversidade(new Filtro(null, dieta, grupo), Math.clamp(faixa, 1, 50));
    }

    @GetMapping("/ocorrencias")
    public List<Agregador.Ponto> ocorrencias(@RequestParam(required = false) Periodo periodo,
                                             @RequestParam(required = false) Dieta dieta,
                                             @RequestParam(required = false) Grupo grupo) {
        return atlas.pontos(new Filtro(periodo, dieta, grupo));
    }

    @GetMapping("/generos/{nome}")
    public AtlasService.FichaGenero genero(@PathVariable String nome) {
        return atlas.ficha(nome);
    }
}
