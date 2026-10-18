import type { ReactNode } from 'react'

interface PanelProps {
  titulo: string
  nota?: string
  destaque?: boolean
  children: ReactNode
}

export function Panel({ titulo, nota, destaque, children }: PanelProps) {
  return (
    <section className={`px panel${destaque ? ' hero' : ''}`}>
      <h2>
        {titulo}
        {nota && <em>{nota}</em>}
      </h2>
      {children}
    </section>
  )
}

interface Opcao<V extends string> {
  v: V
  nome: string
  cor?: string
}

interface OptionGroupProps<V extends string> {
  opcoes: Opcao<V>[]
  valor: V | undefined
  todos: string
  onChange: (v: V | undefined) => void
}

export function OptionGroup<V extends string>({ opcoes, valor, todos, onChange }: OptionGroupProps<V>) {
  return (
    <div className="opts">
      <button className="opt px" aria-pressed={valor === undefined} onClick={() => onChange(undefined)}>
        {todos}
      </button>
      {opcoes.map((o) => (
        <button key={o.v} className="opt px" aria-pressed={valor === o.v} onClick={() => onChange(o.v)}>
          {o.cor && <i style={{ background: o.cor }} />}
          {o.nome}
        </button>
      ))}
    </div>
  )
}

interface HpBarProps {
  nome: string
  direita: string
  pct: number
  cor: string
}

export function HpBar({ nome, direita, pct, cor }: HpBarProps) {
  const p = Math.round(pct)
  return (
    <div className="hp">
      <div className="hp-top">
        <b>{nome}</b>
        <span>{direita}</span>
      </div>
      <div className="bar" role="meter" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100} aria-label={nome}>
        <span style={{ width: `${p}%`, background: cor }} />
        <em>{p}%</em>
      </div>
    </div>
  )
}
