import { useEffect, useState } from 'react'
import { api } from '../api'
import type { FaixaTempo, Fatia, FichaGenero, Filtro, PaisTotal, Ponto, Resumo } from '../types'

export interface Painel {
  resumo: Resumo
  dieta: Fatia[]
  grupos: Fatia[]
  paises: PaisTotal[]
  diversidade: FaixaTempo[]
  pontos: Ponto[]
}

/** Recarrega todos os painéis quando o filtro muda; cancela a rodada anterior. */
export function usePainel(filtro: Filtro) {
  const [dados, setDados] = useState<Painel | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    const s = ctrl.signal
    setCarregando(true)
    Promise.all([
      api.resumo(filtro, s),
      api.dieta(filtro, s),
      api.grupos(filtro, s),
      api.paises(filtro, 8, s),
      api.diversidade(filtro, 10, s),
      api.ocorrencias(filtro, s),
    ])
      .then(([resumo, dieta, grupos, paises, diversidade, pontos]) => {
        setDados({ resumo, dieta, grupos, paises, diversidade, pontos })
        setErro(null)
      })
      .catch((e: unknown) => {
        if (s.aborted) return
        setErro(e instanceof Error && !(e instanceof TypeError) ? e.message : 'Não consegui falar com a API. Ela está rodando?')
      })
      .finally(() => !s.aborted && setCarregando(false))
    return () => ctrl.abort()
  }, [filtro.periodo, filtro.dieta])

  return { dados, erro, carregando }
}

export function useFicha(genero: string | null) {
  const [ficha, setFicha] = useState<FichaGenero | null>(null)

  useEffect(() => {
    if (!genero) return
    const ctrl = new AbortController()
    api.genero(genero, ctrl.signal).then(setFicha).catch(() => {})
    return () => ctrl.abort()
  }, [genero])

  return ficha
}
