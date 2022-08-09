import { useQuery } from '@tanstack/react-query'
import { scalePow } from 'd3'
import { useResizeDetector } from 'react-resize-detector'

import BarChart from '../components/BarChart'
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
      <div className="flex-1 flex flex-col">
        <BarChart
          data={as.data}
          x={(d) => d.population}
          y={(d) => d.asName}
          marginLeft={175}
          color="#999"
          titleColor="black"
          height={height}
          xType={scalePow}
        />
      </div>
    </div>
  )
}
