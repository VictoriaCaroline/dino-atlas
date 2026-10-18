import * as echarts from 'echarts/core'
import { BarChart, LineChart, ScatterChart, TreeChart } from 'echarts/charts'
import { GeoComponent, GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, LineChart, ScatterChart, TreeChart, GeoComponent, GridComponent, TooltipComponent, CanvasRenderer])

export { echarts }
