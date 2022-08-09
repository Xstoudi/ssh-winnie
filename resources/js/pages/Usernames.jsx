import { useQuery } from '@tanstack/react-query'
import { scalePow } from 'd3'
import { useResizeDetector } from 'react-resize-detector'

import BarChart from '../components/BarChart'
import Table from '../components/Table'
import useHost from '../hooks/useHost'
import { getUsernames } from '../services/stats'
import trimLabel from '../utils/trimLabel'

export default function Usernames() {
  const [host] = useHost()
  const usernames = useQuery(['stats-usernames', host.id], getUsernames(host.id))
  const { height = 800, ref: heightWatchedRef } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200,
  })

  if (usernames.isError || usernames.isLoading) return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div ref={heightWatchedRef}>
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
      <BarChart
        data={usernames.data}
        x={(d) => d.population}
        y={(d) => d.username}
        marginLeft={175}
        color="#999"
        titleColor="black"
        height={height}
        xType={scalePow}
      />
    </div>
  )
}
