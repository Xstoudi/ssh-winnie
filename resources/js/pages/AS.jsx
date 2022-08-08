import { useQuery } from '@tanstack/react-query'
import BarChart from '../components/BarChart'

import Table from '../components/Table'
import { getAS } from '../services/stats'
import trimLabel from '../utils/trimLabel'

export default function AS() {
  const as = useQuery(['as'], getAS)
  if (as.isError || as.isLoading) return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div>
        <Table
          columns={[
            { label: 'AS name', key: 'asName' },
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
      <div className="flex-1 flex flex-col">
        <BarChart
          data={as.data}
          x={(d) => d.population}
          y={(d) => d.asName}
          marginLeft={175}
          color="#999"
          titleColor="black"
        />
      </div>
    </div>
  )
}
