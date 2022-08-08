import { useQuery } from '@tanstack/react-query'
import BarChart from '../components/BarChart'

import Table from '../components/Table'
import { getUsernames } from '../services/stats'

export default function Usernames() {
  const usernames = useQuery(['usernames'], getUsernames)
  if (usernames.isError || usernames.isLoading) return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div>
        <Table
          columns={[
            { label: 'Username', key: 'username' },
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
      <div className="flex-1 flex flex-col">
        <BarChart
          data={usernames.data}
          x={(d) => d.population}
          y={(d) => d.username}
          marginLeft={75}
          color="#999"
          titleColor="black"
        />
      </div>
    </div>
  )
}
