import { useQuery } from '@tanstack/react-query'
import BarChart from '../components/BarChart'

import Table from '../components/Table'
import { getPasswords } from '../services/stats'
import trimLabel from '../utils/trimLabel'

export default function Passwords() {
  const passwords = useQuery(['passwords'], getPasswords)
  if (passwords.isError || passwords.isLoading) return <h1>Loading...</h1>

  const data = passwords.data.map((d) => ({ ...d, password: trimLabel(d.password) }))

  return (
    <div className="flex">
      <div>
        <Table
          columns={[
            { label: 'Password', key: 'password' },
            {
              label: 'Attempts',
              key: 'population',
              align: 'right',
              format: (x) => x.toLocaleString(),
            },
          ]}
          datas={data}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <BarChart
          data={data}
          x={(d) => d.population}
          y={(d) => d.password}
          marginLeft={125}
          color="#999"
          titleColor="black"
        />
      </div>
    </div>
  )
}
