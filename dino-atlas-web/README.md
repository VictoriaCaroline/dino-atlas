# Dino Atlas Web

Front-end do Atlas Mesozoico: painel 8-bit com fósseis de dinossauros, consumindo a [dino-atlas-api](../dino-atlas-api).

React 18 · TypeScript · Vite · ECharts

## Rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Abre em `http://localhost:5173`.

- **Com o back-end:** suba a `dino-atlas-api` na porta 8080 e deixe `VITE_MOCK=false`.
- **Sem o back-end:** `VITE_MOCK=true` usa a amostra embutida em `src/api/mock.ts`. Serve para deploy estático de demonstração.

## Estrutura

```
src/
  api/          cliente HTTP, mock e o seletor entre os dois
  hooks/        usePainel (todos os painéis, com cancelamento) e useFicha
  components/   Panel, OptionGroup, HpBar, gráficos ECharts, QuestLog, Sprite
  styles/       retro.css (moldura pixelada, barras de HP)
  theme.ts      cores e rótulos de período, dieta e grupo
  types.ts      contratos espelhando os records da API
```

O mapa usa o contorno de países do `world-atlas`. O ECharts é importado por módulo (`components/echarts.ts`) para não carregar a biblioteca inteira.
