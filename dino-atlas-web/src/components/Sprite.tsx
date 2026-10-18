import { useEffect, useRef } from 'react'

const SAUROPODE = [
  '............XX..',
  '...........XXXX.',
  '...........XX...',
  '..........XX....',
  '.........XX.....',
  '....XXXXXXX.....',
  '..XXXXXXXXXX....',
  'XXXXXXXXXXXX....',
  '....XX...XX.....',
  '....XX...XX.....',
]

export function Sprite({ cor, altura = 16, className }: { cor: string; altura?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = ref.current!.getContext('2d')!
    ctx.clearRect(0, 0, 16, altura)
    ctx.fillStyle = cor
    const topo = Math.floor((altura - SAUROPODE.length) / 2)
    SAUROPODE.forEach((linha, y) =>
      [...linha].forEach((c, x) => c === 'X' && ctx.fillRect(x, y + topo, 1, 1)),
    )
  }, [cor, altura])

  return <canvas ref={ref} width={16} height={altura} className={className} aria-hidden="true" />
}
