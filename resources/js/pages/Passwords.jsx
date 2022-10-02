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
import { getPasswords } from '../services/stats'
import trimLabel from '../utils/trimLabel'

export default function Passwords() {
  const [host] = useHost()
  const passwords = useQuery(['stats-passwords', host.id], getPasswords(host.id))

  if (passwords.isError || passwords.isLoading) return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div className="flex flex-col gap-3">
        <a
          href="/downloads/passwords"
          target="_blank"
          class="w-full text-center inline-block px-12 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded active:text-greeb-500 hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
        >
          Download
        </a>
        <Table
          columns={[
            { label: 'Password', key: 'password', format: (x) => trimLabel(x) },
            {
              label: 'Attempts',
              key: 'population',
              align: 'right',
              format: (x) => x.toLocaleString(),
            },
          ]}
          datas={passwords.data}
        />
      </div>
      <div className="flex-1">
        <ResponsiveContainer height="100%">
          <BarChart data={passwords.data} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" scale="log" domain={['auto', 'auto']} />
            <YAxis dataKey="password" type="category" tickFormatter={(x) => trimLabel(x)} />
            <Tooltip />
            <Legend />
            <Bar dataKey="population" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
