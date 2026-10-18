import { useEffect, useState } from 'react'
import { Sprite } from './Sprite'
import { corDieta, corGrupo, corPeriodo, fmt } from '../theme'
import type { FichaGenero } from '../types'

const reduzMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useDigitando(texto: string, animar: boolean) {
  const [n, setN] = useState(texto.length)

  useEffect(() => {
    if (!animar || reduzMovimento()) {
      setN(texto.length)
      return
    }
    setN(0)
    const id = setInterval(() => setN((i) => (i >= texto.length ? (clearInterval(id), i) : i + 1)), 18)
    return () => clearInterval(id)
  }, [texto, animar])

  return texto.slice(0, n)
}

export function QuestLog({ ficha, animar }: { ficha: FichaGenero | null; animar: boolean }) {
  const fala = ficha
    ? `${ficha.periodo}, de ${ficha.idadeMaxMa} a ${ficha.idadeMinMa} milhões de anos. ${ficha.dieta}, do grupo dos ${ficha.grupo.toLowerCase()}.`
    : ''
  const texto = useDigitando(fala, animar)

  if (!ficha) {
    return <p className="vazio">Clique num ponto do mapa para abrir a ficha.</p>
  }

  return (
    <>
      <div className="dialog">
        <div className="avatar px">
          <Sprite cor={corGrupo(ficha.grupo)} />
        </div>
        <div className="bubble px">
          <b>{ficha.genero}</b>
          <p aria-live="polite">{texto}</p>
        </div>
      </div>
      <dl className="stats">
        <dt>CLASSE</dt>
        <dd style={{ color: corGrupo(ficha.grupo) }}>{ficha.grupo}</dd>
        <dt>DIETA</dt>
        <dd style={{ color: corDieta(ficha.dieta) }}>{ficha.dieta}</dd>
        <dt>ERA</dt>
        <dd style={{ color: corPeriodo(ficha.periodo) }}>{ficha.periodo}</dd>
        <dt>XP</dt>
        <dd>{fmt(ficha.ocorrencias)} registros</dd>
        <dt>MAPA</dt>
        <dd>{ficha.paises.map((p) => p.nome).join(', ')}</dd>
      </dl>
      <a href={ficha.wikipedia} target="_blank" rel="noopener noreferrer">
        &gt; Abrir verbete
      </a>
    </>
  )
}
