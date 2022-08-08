import startCase from 'lodash.startcase'
import { useQuery } from '@tanstack/react-query'
import Stat from '../components/Stat'
import { getDashboard } from '../services/stats'

export default function Dashboard() {
  const stats = useQuery(['dashboard'], getDashboard)

  if (stats.isError || stats.isLoading) return <h1>Loading...</h1>

  const keys = Object.keys(stats.data)

  return (
    <div class="mt-8 sm:mt-12">
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {keys.map((key) => (
          <Stat key={key} name={startCase(key)} value={Number(stats.data[key]).toLocaleString()} />
        ))}
      </dl>
    </div>
  )
}
