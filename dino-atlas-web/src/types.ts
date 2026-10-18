export type Periodo = 'TRIASSICO' | 'JURASSICO' | 'CRETACEO' | 'PALEOGENO' | 'NEOGENO' | 'QUATERNARIO'
export type Dieta = 'CARNIVORO' | 'HERBIVORO' | 'ONIVORO' | 'DESCONHECIDA'
export type Grupo = 'THEROPODA' | 'AVES' | 'SAUROPODOMORPHA' | 'ORNITHISCHIA' | 'OUTROS'

export interface Filtro {
  periodo?: Periodo
  dieta?: Dieta
}

export interface Resumo {
  ocorrencias: number
  generos: number
  paises: number
  idadeMaxMa: number
  idadeMinMa: number
}

export interface Fatia {
  chave: string
  nome: string
  total: number
  percentual: number
}

export interface PaisTotal {
  codigo: string
  nome: string
  total: number
}

export interface FaixaTempo {
  inicioMa: number
  fimMa: number
  generos: number
}

export interface Ponto {
  id: number
  /** null quando o fóssil não foi identificado até gênero */
  genero: string | null
  nome: string
  lat: number
  lng: number
  periodo: string
  grupo: string
}

export interface FichaGenero {
  genero: string
  grupo: string
  dieta: string
  periodo: string
  idadeMaxMa: number
  idadeMinMa: number
  ocorrencias: number
  paises: PaisTotal[]
  verbete: Verbete
}

export interface Verbete {
  fonte: 'pt' | 'en' | 'pbdb'
  titulo: string
  resumo: string | null
  imagem: string | null
  url: string
}

export interface AtlasApi {
  resumo(f: Filtro, signal?: AbortSignal): Promise<Resumo>
  dieta(f: Filtro, signal?: AbortSignal): Promise<Fatia[]>
  grupos(f: Filtro, signal?: AbortSignal): Promise<Fatia[]>
  paises(f: Filtro, top: number, signal?: AbortSignal): Promise<PaisTotal[]>
  diversidade(f: Filtro, faixa: number, signal?: AbortSignal): Promise<FaixaTempo[]>
  ocorrencias(f: Filtro, signal?: AbortSignal): Promise<Ponto[]>
  genero(nome: string, signal?: AbortSignal): Promise<FichaGenero>
}
