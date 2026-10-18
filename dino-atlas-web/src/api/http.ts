import type { AtlasApi, Filtro } from '../types'

const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')

export class ApiErro extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function get<T>(caminho: string, params: Record<string, string | number | undefined>, signal?: AbortSignal): Promise<T> {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) qs.set(k, String(v))
  }
  const url = `${BASE}/api${caminho}${qs.size ? `?${qs}` : ''}`
  const resp = await fetch(url, { signal })
  if (!resp.ok) {
    const msg = resp.status === 503 ? 'A API ainda está baixando os dados do PBDB.' : `Erro ${resp.status} em ${caminho}`
    throw new ApiErro(resp.status, msg)
  }
  return resp.json() as Promise<T>
}

const f2p = (f: Filtro) => ({ periodo: f.periodo, dieta: f.dieta })

export const httpApi: AtlasApi = {
  resumo: (f, s) => get('/resumo', f2p(f), s),
  dieta: (f, s) => get('/dieta', { periodo: f.periodo }, s),
  grupos: (f, s) => get('/grupos', f2p(f), s),
  paises: (f, top, s) => get('/paises', { ...f2p(f), top }, s),
  diversidade: (f, faixa, s) => get('/diversidade', { dieta: f.dieta, faixa }, s),
  ocorrencias: (f, s) => get('/ocorrencias', f2p(f), s),
  genero: (nome, s) => get(`/generos/${encodeURIComponent(nome)}`, {}, s),
}
