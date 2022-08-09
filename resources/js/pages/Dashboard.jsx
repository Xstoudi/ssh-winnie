import startCase from 'lodash.startcase'
import { useQuery } from '@tanstack/react-query'
import Stat from '../components/Stat'
import { getDashboard } from '../services/stats'
import useHost from '../hooks/useHost'

export default function Dashboard() {
  const [host] = useHost()
  const stats = useQuery(['stats-dashboard', host.id], getDashboard(host.id))

  if (stats.isError || stats.isLoading) return <h1>Loading...</h1>

  const keys = Object.keys(stats.data)

  return (
    <div className="mt-8 sm:mt-12">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {keys.map((key) => (
          <Stat key={key} name={startCase(key)} value={Number(stats.data[key]).toLocaleString()} />
        ))}
      </dl>
    </div>
  )
}
