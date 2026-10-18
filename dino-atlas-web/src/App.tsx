import { useState } from 'react'
import { usandoMock } from './api'
import { useFicha, usePainel } from './hooks/useAtlas'
import { HpBar, OptionGroup, Panel } from './components/Pixel'
import { SkillTree, Timeline, TopCountries, WorldMap } from './components/Charts'
import { QuestLog } from './components/QuestLog'
import { Sprite } from './components/Sprite'
import { COR, DIETAS, GRUPOS, PERIODOS, corDieta, fmt } from './theme'
import type { Filtro } from './types'

export default function App() {
  const [filtro, setFiltro] = useState<Filtro>({})
  const [genero, setGenero] = useState<string | null>(null)
  const { dados, erro, carregando } = usePainel(filtro)
  const ficha = useFicha(genero ?? dados?.pontos.find((p) => p.genero)?.genero ?? null)

  const r = dados?.resumo
  const total = r?.ocorrencias ?? 0

  return (
    <div className="wrap">
      <nav className="px">
        <div className="logo">
          <Sprite cor={COR.orange} altura={10} />
          DINO.EXE
        </div>
        <div className="tag">
          {usandoMock ? 'MODO DEMO · DADOS DE EXEMPLO' : carregando ? 'CARREGANDO' : 'ONLINE · PBDB'}
          <span className="blink">_</span>
        </div>
      </nav>

      <header>
        <h1>Atlas Mesozoico</h1>
        <p className="lead">
          Todas as ocorrências fósseis de dinossauros, dos primeiros do Triássico às aves do Quaternário, incluindo material
          sem gênero identificado. Filtre por período e dieta, clique num ponto do mapa para abrir a ficha do gênero.
        </p>
      </header>

      {erro && (
        <div className="px erro" role="alert">
          GAME OVER: {erro}
        </div>
      )}

      <section className="kpis" aria-label="Resumo">
        <div className="kpi px"><small>OCORRÊNCIAS</small><b>{fmt(total)}</b></div>
        <div className="kpi px"><small>GÊNEROS</small><b>{fmt(r?.generos ?? 0)}</b></div>
        <div className="kpi px"><small>PAÍSES</small><b>{fmt(r?.paises ?? 0)}</b></div>
        <div className="kpi px"><small>JANELA (MA)</small><b>{r && total ? `${Math.round(r.idadeMaxMa)}-${Math.round(r.idadeMinMa)}` : '-'}</b></div>
      </section>

      <div className={`grid${carregando ? ' ocupado' : ''}`}>
        <div className="col">
          <Panel titulo="Select Period">
            <OptionGroup opcoes={PERIODOS} valor={filtro.periodo} todos="Todos" onChange={(periodo) => setFiltro((f) => ({ ...f, periodo }))} />
          </Panel>
          <Panel titulo="Dieta">
            <OptionGroup opcoes={DIETAS.slice(0, 3)} valor={filtro.dieta} todos="Todas" onChange={(dieta) => setFiltro((f) => ({ ...f, dieta }))} />
          </Panel>
          <Panel titulo="Dieta" nota="% registros">
            <div className="stack">
              {dados?.dieta.map((d) => (
                <HpBar key={d.chave} nome={d.nome} direita={fmt(d.total)} pct={d.percentual} cor={corDieta(d.nome)} />
              ))}
            </div>
          </Panel>
        </div>

        <div className="col center">
          <Panel titulo="World Map" nota="clique num ponto" destaque>
            <WorldMap pontos={dados?.pontos ?? []} onSelect={setGenero} />
          </Panel>
          <Panel titulo="Party" nota="composição por grupo">
            <div className="groups">
              {GRUPOS.map((g) => {
                const f = dados?.grupos.find((x) => x.chave === g.v)
                return (
                  <HpBar key={g.v} nome={g.nome} direita={`${fmt(f?.total ?? 0)}/${fmt(total)}`} pct={f?.percentual ?? 0} cor={g.cor} />
                )
              })}
            </div>
          </Panel>
          <Panel titulo="Skill Tree" nota="clados principais">
            <SkillTree grupos={dados?.grupos ?? []} />
          </Panel>
        </div>

        <div className="col">
          <Panel titulo="Quest Log">
            <QuestLog ficha={ficha} animar={genero !== null} />
          </Panel>
          <Panel titulo="High Score" nota="países">
            <TopCountries paises={dados?.paises ?? []} />
          </Panel>
          <Panel titulo="Timeline" nota="gêneros / 10 Ma">
            <Timeline faixas={dados?.diversidade ?? []} />
          </Panel>
        </div>
      </div>

      <footer>dados: paleobiodb.org · fichas: pt.wikipedia.org</footer>
    </div>
  )
}
