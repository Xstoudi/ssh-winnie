import { useQuery } from '@tanstack/react-query'
import { scalePow } from 'd3'
import { useResizeDetector } from 'react-resize-detector'

import BarChart from '../components/BarChart'
import Table from '../components/Table'
import useHost from '../hooks/useHost'
import { getPasswords } from '../services/stats'
import trimLabel from '../utils/trimLabel'

export default function Passwords() {
  const [host] = useHost()
  const passwords = useQuery(['stats-passwords', host.id], getPasswords(host.id))
  const { height = 800, ref: heightWatchedRef } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200,
  })

  if (passwords.isError || passwords.isLoading) return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div ref={heightWatchedRef}>
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
      <div className="flex-1 flex flex-col">
        <BarChart
          data={passwords.data}
          x={(d) => d.population}
          y={(d) => d.password}
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
