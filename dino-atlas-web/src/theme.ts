import type { Dieta, Grupo, Periodo } from './types'

export const COR = {
  fg: '#f2f2f2',
  muted: '#9a9a9a',
  dim: '#5c5c5c',
  red: '#e84848',
  green: '#58d858',
  yellow: '#f8b800',
  blue: '#3cbcfc',
  purple: '#b878f8',
  orange: '#fc8c50',
  pink: '#f878b8',
  lime: '#b8f818',
  cyan: '#58f8d8',
}

export const FONTE = {
  pixel: '"Press Start 2P", monospace',
  term: 'VT323, monospace',
}

export const PERIODOS: { v: Periodo; nome: string; cor: string }[] = [
  { v: 'TRIASSICO', nome: 'Triássico', cor: COR.purple },
  { v: 'JURASSICO', nome: 'Jurássico', cor: COR.blue },
  { v: 'CRETACEO', nome: 'Cretáceo', cor: COR.orange },
  { v: 'PALEOGENO', nome: 'Paleógeno', cor: COR.pink },
  { v: 'NEOGENO', nome: 'Neógeno', cor: COR.lime },
  { v: 'QUATERNARIO', nome: 'Quaternário', cor: COR.cyan },
]

export const DIETAS: { v: Dieta; nome: string; cor: string }[] = [
  { v: 'CARNIVORO', nome: 'Carnívoro', cor: COR.red },
  { v: 'HERBIVORO', nome: 'Herbívoro', cor: COR.green },
  { v: 'ONIVORO', nome: 'Onívoro', cor: COR.yellow },
  { v: 'DESCONHECIDA', nome: 'Desconhecida', cor: COR.dim },
]

export const GRUPOS: { v: Grupo; nome: string; latim: string; cor: string }[] = [
  { v: 'THEROPODA', nome: 'Terópodes', latim: 'Theropoda', cor: COR.red },
  { v: 'AVES', nome: 'Aves', latim: 'Aves', cor: COR.yellow },
  { v: 'SAUROPODOMORPHA', nome: 'Sauropodomorfos', latim: 'Sauropodomorpha', cor: COR.blue },
  { v: 'ORNITHISCHIA', nome: 'Ornitísquios', latim: 'Ornithischia', cor: COR.green },
  { v: 'OUTROS', nome: 'Outros', latim: 'Outros', cor: COR.muted },
]

const porNome = <T extends { nome: string; cor: string }>(lista: T[], nome: string) =>
  lista.find((x) => x.nome === nome)?.cor ?? COR.dim

export const corPeriodo = (nome: string) => porNome(PERIODOS, nome)
export const corGrupo = (nome: string) => porNome(GRUPOS, nome)
export const corDieta = (nome: string) => porNome(DIETAS, nome)

export const fmt = (n: number) => n.toLocaleString('pt-BR')
