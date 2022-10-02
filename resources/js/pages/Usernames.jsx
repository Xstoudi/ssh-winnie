import { useQuery } from '@tanstack/react-query'
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
import { getUsernames } from '../services/stats'
import trimLabel from '../utils/trimLabel'

export default function Usernames() {
  const [host] = useHost()
  const usernames = useQuery(['stats-usernames', host.id], getUsernames(host.id))

  if (usernames.isError || usernames.isLoading) return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div className="flex flex-col gap-3">
        <a
          href="/downloads/usernames"
          target="_blank"
          class="w-full text-center inline-block px-12 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded active:text-greeb-500 hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
        >
          Download
        </a>
        <Table
          columns={[
            { label: 'Username', key: 'username', format: (x) => trimLabel(x) },
            {
              label: 'Attempts',
              key: 'population',
              align: 'right',
              format: (x) => x.toLocaleString(),
            },
          ]}
          datas={usernames.data}
        />
      </div>
      <div className="flex-1">
        <ResponsiveContainer height="100%">
          <BarChart data={usernames.data} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" scale="log" domain={['auto', 'auto']} />
            <YAxis dataKey="username" type="category" tickFormatter={(x) => trimLabel(x)} />
            <Tooltip />
            <Legend />
            <Bar dataKey="population" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
