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
import { getIdentities } from '../services/stats'
import trimLabel from '../utils/trimLabel'

export default function Identities() {
  const [host] = useHost()
  const identities = useQuery(['stats-identities', host.id], getIdentities(host.id))
  const { height = 800, ref: heightWatchedRef } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200,
  })

  if (identities.isError || identities.isLoading) return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div>
        <Table
          columns={[
            { label: 'Identity', key: 'remoteIdentity', format: (x) => trimLabel(x) },
            {
              label: 'Attempts',
              key: 'population',
              align: 'right',
              format: (x) => x.toLocaleString(),
            },
          ]}
          datas={identities.data}
        />
      </div>
      <div className="flex-1">
        <ResponsiveContainer height="100%">
          <BarChart data={identities.data} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" scale="log" domain={['auto', 'auto']} />
            <YAxis dataKey="remoteIdentity" type="category" tickFormatter={(x) => trimLabel(x)} />
            <Tooltip />
            <Legend />
            <Bar dataKey="population" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
