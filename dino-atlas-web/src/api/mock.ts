import type { AtlasApi, Dieta, Filtro, Grupo, PaisTotal, Periodo } from '../types'
import { DIETAS, GRUPOS, PERIODOS } from '../theme'

// Amostra para rodar sem back-end. Gêneros e locais reais, contagens ilustrativas.
// Primeiro campo: gênero, ou "=Nome" para material sem gênero identificado
type Reg = [string, Grupo, Dieta, Periodo, number, string, number, number, number]
const T = 'THEROPODA', S = 'SAUROPODOMORPHA', O = 'ORNITHISCHIA', A = 'AVES', X = 'OUTROS'
const C = 'CARNIVORO', H = 'HERBIVORO', N = 'ONIVORO', D = 'DESCONHECIDA'
const TR = 'TRIASSICO', JU = 'JURASSICO', CR = 'CRETACEO', PA = 'PALEOGENO', NE = 'NEOGENO', QU = 'QUATERNARIO'

const RAW: Reg[] = [
  ['Tyrannosaurus', T, C, CR, 67, 'US', 47.6, -106.6, 42], ['Triceratops', O, H, CR, 67, 'US', 46.9, -103.5, 61],
  ['Edmontosaurus', O, H, CR, 67, 'US', 45.9, -104.0, 38], ['Ankylosaurus', O, H, CR, 67, 'US', 47.0, -105.5, 7],
  ['Pachycephalosaurus', O, H, CR, 67, 'US', 46.5, -104.5, 12], ['Deinonychus', T, C, CR, 112, 'US', 45.2, -108.9, 9],
  ['Allosaurus', T, C, JU, 152, 'US', 39.3, -110.7, 45], ['Stegosaurus', O, H, JU, 152, 'US', 38.4, -105.2, 23],
  ['Diplodocus', S, H, JU, 152, 'US', 40.4, -109.3, 18], ['Apatosaurus', S, H, JU, 152, 'US', 41.9, -106.2, 14],
  ['Camarasaurus', S, H, JU, 152, 'US', 40.45, -109.25, 30], ['Coelophysis', T, C, TR, 205, 'US', 36.3, -106.5, 26],
  ['Albertosaurus', T, C, CR, 70, 'CA', 51.46, -112.71, 15], ['Centrosaurus', O, H, CR, 76, 'CA', 50.76, -111.5, 34],
  ['Corythosaurus', O, H, CR, 76, 'CA', 50.77, -111.48, 22], ['Gorgosaurus', T, C, CR, 76, 'CA', 50.74, -111.52, 19],
  ['Velociraptor', T, C, CR, 75, 'MN', 44.2, 103.7, 16], ['Protoceratops', O, H, CR, 75, 'MN', 44.15, 103.72, 48],
  ['Oviraptor', T, N, CR, 75, 'MN', 44.0, 104.0, 6], ['Tarbosaurus', T, C, CR, 70, 'MN', 43.48, 101.0, 21],
  ['Gallimimus', T, N, CR, 70, 'MN', 43.5, 100.8, 11], ['Sinosauropteryx', T, C, CR, 125, 'CN', 41.6, 120.8, 8],
  ['Psittacosaurus', O, H, CR, 125, 'CN', 41.7, 120.9, 40], ['Microraptor', T, C, CR, 120, 'CN', 41.3, 120.6, 10],
  ['Yutyrannus', T, C, CR, 125, 'CN', 41.5, 121.0, 3], ['Mamenchisaurus', S, H, JU, 160, 'CN', 29.4, 104.8, 9],
  ['Spinosaurus', T, C, CR, 97, 'MA', 30.8, -4.0, 11], ['Giraffatitan', S, H, JU, 150, 'TZ', -9.7, 39.3, 12],
  ['Kentrosaurus', O, H, JU, 150, 'TZ', -9.75, 39.25, 9], ['Heterodontosaurus', O, N, JU, 195, 'ZA', -30.6, 27.4, 4],
  ['Massospondylus', S, H, JU, 195, 'ZA', -28.9, 28.0, 27], ['Lesothosaurus', O, H, JU, 195, 'LS', -29.6, 28.2, 6],
  ['Argentinosaurus', S, H, CR, 95, 'AR', -38.9, -69.2, 3], ['Giganotosaurus', T, C, CR, 97, 'AR', -39.25, -68.8, 5],
  ['Carnotaurus', T, C, CR, 72, 'AR', -43.0, -70.0, 2], ['Herrerasaurus', T, C, TR, 231, 'AR', -30.0, -67.8, 14],
  ['Eoraptor', S, N, TR, 231, 'AR', -30.1, -67.9, 9], ['Staurikosaurus', T, C, TR, 233, 'BR', -29.7, -53.8, 2],
  ['Buriolestes', S, C, TR, 233, 'BR', -29.6, -53.6, 4], ['Saturnalia', S, N, TR, 233, 'BR', -29.7, -53.9, 5],
  ['Maxakalisaurus', S, H, CR, 80, 'BR', -19.3, -48.9, 3], ['Irritator', T, C, CR, 113, 'BR', -7.2, -39.6, 2],
  ['Iguanodon', O, H, CR, 126, 'BE', 50.45, 3.85, 38], ['Baryonyx', T, C, CR, 125, 'GB', 51.1, -0.5, 4],
  ['Hypsilophodon', O, H, CR, 125, 'GB', 50.65, -1.4, 17], ['Megalosaurus', T, C, JU, 166, 'GB', 51.8, -1.3, 8],
  ['Plateosaurus', S, H, TR, 210, 'DE', 48.07, 8.63, 52], ['Compsognathus', T, C, JU, 150, 'DE', 48.9, 11.2, 2],
  ['Europasaurus', S, H, JU, 154, 'DE', 51.9, 10.6, 14], ['Lourinhanosaurus', T, C, JU, 150, 'PT', 39.2, -9.3, 3],
  ['Muttaburrasaurus', O, H, CR, 100, 'AU', -22.6, 144.5, 3], ['Australovenator', T, C, CR, 95, 'AU', -22.4, 143.0, 2],
  ['Diamantinasaurus', S, H, CR, 95, 'AU', -22.3, 143.1, 4], ['Cryolophosaurus', T, C, JU, 190, 'AQ', -84.3, 166.7, 2],
  ['Archaeopteryx', A, C, JU, 150, 'DE', 48.92, 11.15, 12], ['Confuciusornis', A, N, CR, 125, 'CN', 41.55, 120.75, 30],
  ['Hesperornis', A, C, CR, 85, 'US', 38.9, -100.9, 9], ['Gastornis', A, H, PA, 50, 'FR', 49.1, 2.9, 14],
  ['Phorusrhacos', A, C, NE, 17, 'AR', -50.0, -69.5, 6], ['Titanis', A, C, NE, 4, 'US', 29.6, -82.6, 3],
  ['Dinornis', A, H, QU, 0.01, 'NZ', -43.5, 172.0, 44], ['Raphus', A, H, QU, 0.01, 'MU', -20.3, 57.6, 21],
  ['=Hadrosauridae', O, D, CR, 75, 'CA', 50.8, -111.4, 58], ['=Tyrannosauridae', T, D, CR, 70, 'US', 46.8, -104.2, 23],
  ['=Sauropoda', S, D, JU, 150, 'TZ', -9.8, 39.4, 17], ['=Dinosauria', X, D, CR, 85, 'BR', -21.5, -50.3, 11],
  ['=Saurischia', X, D, TR, 225, 'IN', 19.2, 79.5, 5],
]

const DADOS = RAW.map(([rotulo, grupo, dieta, periodo, ma, cc, lat, lng, n], i) => {
  const indet = rotulo.startsWith('=')
  return { id: i + 1, genero: indet ? null : rotulo, nome: indet ? rotulo.slice(1) : rotulo, grupo, dieta, periodo, ma, cc, lat, lng, n }
})
type Dado = (typeof DADOS)[number]

const nomesPais = new Intl.DisplayNames(['pt-BR'], { type: 'region' })
const nomePais = (cc: string) => nomesPais.of(cc) ?? cc
const nomeDe = <V extends string>(lista: { v: V; nome: string }[], v: V) => lista.find((x) => x.v === v)!.nome
const soma = (l: Dado[]) => l.reduce((s, d) => s + d.n, 0)
const filtrar = (f: Filtro) => DADOS.filter((d) => (!f.periodo || d.periodo === f.periodo) && (!f.dieta || d.dieta === f.dieta))
const atraso = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 120))

function fatias<V extends string>(l: Dado[], chave: (d: Dado) => V, lista: { v: V; nome: string }[]) {
  const tot = soma(l)
  return lista
    .map(({ v, nome }) => ({ chave: v, nome, total: soma(l.filter((d) => chave(d) === v)) }))
    .filter((x) => x.total > 0)
    .map((x) => ({ ...x, percentual: Math.round((x.total * 1000) / tot) / 10 }))
}

function topPaises(l: Dado[], top: number): PaisTotal[] {
  const m = new Map<string, number>()
  l.forEach((d) => m.set(d.cc, (m.get(d.cc) ?? 0) + d.n))
  return [...m].sort((a, b) => b[1] - a[1]).slice(0, top).map(([codigo, total]) => ({ codigo, nome: nomePais(codigo), total }))
}

export const mockApi: AtlasApi = {
  resumo: (f) => {
    const l = filtrar(f)
    const idades = l.map((d) => d.ma)
    return atraso({
      ocorrencias: soma(l),
      generos: new Set(l.filter((d) => d.genero).map((d) => d.genero)).size,
      paises: new Set(l.map((d) => d.cc)).size,
      idadeMaxMa: l.length ? Math.max(...idades) : 0,
      idadeMinMa: l.length ? Math.min(...idades) : 0,
    })
  },
  dieta: (f) => atraso(fatias(filtrar({ periodo: f.periodo }), (d) => d.dieta, DIETAS)),
  grupos: (f) => atraso(fatias(filtrar(f), (d) => d.grupo, GRUPOS)),
  paises: (f, top) => atraso(topPaises(filtrar(f), top)),
  diversidade: (f, faixa) => {
    const m = new Map<number, Set<string>>()
    filtrar({ dieta: f.dieta }).forEach((d) => {
      if (!d.genero) return
      const ini = Math.max(faixa, Math.ceil(d.ma / faixa) * faixa)
      if (!m.has(ini)) m.set(ini, new Set())
      m.get(ini)!.add(d.genero)
    })
    return atraso([...m].sort((a, b) => b[0] - a[0]).map(([ini, s]) => ({ inicioMa: ini, fimMa: ini - faixa, generos: s.size })))
  },
  ocorrencias: (f) =>
    atraso(filtrar(f).map((d) => ({
      id: d.id, genero: d.genero, nome: d.nome, lat: d.lat, lng: d.lng,
      periodo: nomeDe(PERIODOS, d.periodo), grupo: nomeDe(GRUPOS, d.grupo),
    }))),
  genero: (nome) => {
    const l = DADOS.filter((d) => d.genero?.toLowerCase() === nome.toLowerCase())
    if (!l.length) return Promise.reject(new Error(`Gênero não encontrado: ${nome}`))
    const d = l[0]
    return atraso({
      genero: d.nome, grupo: nomeDe(GRUPOS, d.grupo), dieta: nomeDe(DIETAS, d.dieta), periodo: nomeDe(PERIODOS, d.periodo),
      idadeMaxMa: d.ma, idadeMinMa: d.ma, ocorrencias: soma(l), paises: topPaises(l, 5),
      wikipedia: `https://pt.wikipedia.org/wiki/${d.genero}`,
    })
  },
}
