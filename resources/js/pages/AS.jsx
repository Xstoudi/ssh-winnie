import { useQuery } from '@tanstack/react-query'
import { scalePow } from 'd3'
import { useResizeDetector } from 'react-resize-detector'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import Table from '../components/Table'
import useHost from '../hooks/useHost'
import { getAS } from '../services/stats'
import trimLabel from '../utils/trimLabel'

export default function AS() {
  const [host] = useHost()
  const as = useQuery(['stats-as', host.id], getAS(host.id))
  const { height = 800, ref: heightWatchedRef } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200,
  })

  if (as.isError || as.isLoading) return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div ref={heightWatchedRef}>
        <Table
          columns={[
            { label: 'AS name', key: 'asName', format: (x) => trimLabel(x) },
            {
              label: 'Attempts',
              key: 'population',
              align: 'right',
              format: (x) => x.toLocaleString(),
            },
          ]}
          datas={as.data}
        />
      </div>
      <div className="flex-1">
        <ResponsiveContainer height="100%">
          <BarChart data={as.data} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" scale="log" domain={['auto', 'auto']} />
            <YAxis dataKey="asName" type="category" tickFormatter={(x) => trimLabel(x)} />
            <Tooltip />
            <Legend />
            <Bar dataKey="population" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
