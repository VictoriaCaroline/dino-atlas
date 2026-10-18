import { useEffect, useRef } from 'react'
import { echarts } from './echarts'
import type { EChartsOption, ECElementEvent } from 'echarts'

interface Props {
  option: EChartsOption
  height: number
  onClick?: (e: ECElementEvent) => void
}

export function EChart({ option, height, onClick }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts | null>(null)
  const clique = useRef(onClick)
  clique.current = onClick

  useEffect(() => {
    const c = echarts.init(el.current!)
    chart.current = c
    c.on('click', (e) => clique.current?.(e as ECElementEvent))
    const ro = new ResizeObserver(() => c.resize())
    ro.observe(el.current!)
    return () => {
      ro.disconnect()
      c.dispose()
    }
  }, [])

  useEffect(() => {
    chart.current?.setOption(option, { notMerge: true })
  }, [option])

  return <div ref={el} style={{ width: '100%', height }} />
}
