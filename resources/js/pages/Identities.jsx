import { useQuery } from '@tanstack/react-query'
import BarChart from '../components/BarChart'

import Table from '../components/Table'
import { getIdentities } from '../services/stats'
import trimLabel from '../utils/trimLabel'

export default function Identities() {
  const identities = useQuery(['identities'], getIdentities)
  if (identities.isError || identities.isLoading) return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div>
        <Table
          columns={[
            { label: 'Identity', key: 'remoteIdentity' },
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
      <div className="flex-1 flex flex-col">
        <BarChart
          data={identities.data.map((d) => ({ ...d, remoteIdentity: trimLabel(d.remoteIdentity) }))}
          x={(d) => d.population}
          y={(d) => d.remoteIdentity}
          marginLeft={175}
          color="#999"
          titleColor="black"
        />
      </div>
    </div>
  )
}
