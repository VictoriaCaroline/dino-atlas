import { useMemo } from 'react'
import { echarts } from './echarts'
import type { EChartsOption } from 'echarts'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import paises110m from 'world-atlas/countries-110m.json'
import { EChart } from './EChart'
import { COR, FONTE, GRUPOS, PERIODOS, fmt } from '../theme'
import type { FaixaTempo, Fatia, PaisTotal, Ponto } from '../types'

const topo = paises110m as unknown as Topology<{ countries: GeometryCollection }>
echarts.registerMap('world', feature(topo, topo.objects.countries) as never)

const tip = {
  backgroundColor: '#0b0b0b',
  borderColor: COR.fg,
  borderWidth: 2,
  padding: 8,
  textStyle: { color: COR.fg, fontFamily: FONTE.term, fontSize: 18 },
  extraCssText: 'border-radius:0;box-shadow:none',
}
const eixo = { color: COR.muted, fontFamily: FONTE.term, fontSize: 16 }

export function WorldMap({ pontos, onSelect }: { pontos: Ponto[]; onSelect: (genero: string) => void }) {
  // Uma série por período: no modo large o ECharts ignora cor por ponto, só respeita a cor da série.
  // Pelo mesmo motivo os pontos vão como [lng, lat] puros e o Ponto é recuperado por seriesIndex/dataIndex.
  const porPeriodo = useMemo(
    () => PERIODOS.map((per) => ({ ...per, pontos: pontos.filter((p) => p.periodo === per.nome) })).filter((g) => g.pontos.length),
    [pontos],
  )
  const achar = (serie?: number, idx?: number) =>
    serie === undefined || idx === undefined ? undefined : porPeriodo[serie]?.pontos[idx]

  const option = useMemo<EChartsOption>(() => {
    const grande = pontos.length > 2000
    return {
      tooltip: {
        ...tip,
        trigger: 'item',
        formatter: (p: any) => {
          const pt = achar(p.seriesIndex, p.dataIndex)
          if (!pt) return p.name
          const nome = pt.genero ?? `${pt.nome} (indet.)`
          return `${nome}<br>${pt.periodo} · ${pt.grupo}`
        },
      },
      geo: {
        map: 'world',
        roam: true,
        zoom: 1.15,
        center: [10, 18],
        scaleLimit: { min: 1, max: 12 },
        itemStyle: { areaColor: '#262626', borderColor: COR.dim, borderWidth: 1 },
        emphasis: { itemStyle: { areaColor: '#3a3a3a' }, label: { show: false } },
      },
      series: porPeriodo.map((g) => ({
        type: 'scatter',
        name: g.nome,
        coordinateSystem: 'geo',
        symbol: 'rect',
        symbolSize: grande ? 4 : 9,
        large: grande,
        largeThreshold: 2000,
        itemStyle: { color: g.cor },
        data: g.pontos.map((p) => [p.lng, p.lat]),
      })),
    }
  }, [porPeriodo])

  return (
    <EChart
      option={option}
      height={480}
      onClick={(e) => {
        const pt = achar(e.seriesIndex, e.dataIndex)
        if (pt?.genero) onSelect(pt.genero)
      }}
    />
  )
}

const ARVORE = {
  name: 'Dinosauria',
  children: [
    { name: 'Saurischia', children: [{ name: 'Theropoda', children: [{ name: 'Aves' }] }, { name: 'Sauropodomorpha' }] },
    { name: 'Ornithischia', children: [{ name: 'Thyreophora' }, { name: 'Ornithopoda' }, { name: 'Marginocephalia' }] },
  ],
}

export function SkillTree({ grupos }: { grupos: Fatia[] }) {
  const option = useMemo<EChartsOption>(() => {
    const info = new Map(GRUPOS.map((g) => [g.latim, { cor: g.cor, total: grupos.find((x) => x.chave === g.v)?.total }]))
    const map = (n: { name: string; children?: any[] }): any => {
      const i = info.get(n.name)
      const cor = i?.cor ?? COR.dim
      return {
        name: i?.total !== undefined ? `${n.name} ${fmt(i.total)}` : n.name,
        children: n.children?.map(map),
        itemStyle: { color: cor, borderColor: cor },
      }
    }
    return {
      series: [{
        type: 'tree',
        data: [map(ARVORE)],
        top: '6%', left: '14%', bottom: '6%', right: '26%',
        symbol: 'rect', symbolSize: 9,
        edgeShape: 'polyline',
        expandAndCollapse: false,
        label: { position: 'left', verticalAlign: 'middle', align: 'right', color: COR.fg, fontFamily: FONTE.term, fontSize: 17 },
        leaves: { label: { position: 'right', align: 'left' } },
        lineStyle: { color: COR.dim, width: 2, curveness: 0 },
      }],
    }
  }, [grupos])

  return <EChart option={option} height={230} />
}

export function TopCountries({ paises }: { paises: PaisTotal[] }) {
  const option = useMemo<EChartsOption>(() => {
    const ordem = [...paises].reverse()
    return {
      tooltip: { ...tip, trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(255,255,255,.05)' } } },
      grid: { left: 4, right: 56, top: 4, bottom: 4, containLabel: true },
      xAxis: { type: 'value', axisLabel: { show: false }, splitLine: { show: false } },
      yAxis: { type: 'category', data: ordem.map((p) => p.nome), axisLabel: eixo, axisLine: { show: false }, axisTick: { show: false } },
      series: [{
        type: 'bar',
        barWidth: 14,
        data: ordem.map((p, i) => ({ value: p.total, itemStyle: { color: i === ordem.length - 1 ? COR.orange : COR.fg } })),
        label: { show: true, position: 'right', color: COR.fg, fontFamily: FONTE.term, fontSize: 17, formatter: (p: any) => fmt(p.value) },
      }],
    }
  }, [paises])

  return <EChart option={option} height={290} />
}

export function Timeline({ faixas }: { faixas: FaixaTempo[] }) {
  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      ...tip,
      trigger: 'axis',
      formatter: (p: any) => `${p[0].name}-${Number(p[0].name) - (faixas[0] ? faixas[0].inicioMa - faixas[0].fimMa : 10)} Ma<br>${p[0].value} gêneros`,
    },
    grid: { left: 36, right: 10, top: 10, bottom: 26 },
    xAxis: { type: 'category', data: faixas.map((f) => f.inicioMa), axisLabel: { ...eixo, interval: 'auto' }, axisLine: { lineStyle: { color: COR.dim, width: 2 } }, axisTick: { show: false } },
    yAxis: { type: 'value', minInterval: 1, axisLabel: eixo, splitLine: { lineStyle: { color: '#222', type: 'dashed' } } },
    series: [{
      type: 'line',
      step: 'middle',
      data: faixas.map((f) => f.generos),
      symbol: 'rect',
      symbolSize: 6,
      lineStyle: { color: COR.blue, width: 3 },
      itemStyle: { color: COR.blue },
      areaStyle: { color: 'rgba(60,188,252,.15)' },
    }],
  }), [faixas])

  return <EChart option={option} height={200} />
}
