import { useQuery } from '@tanstack/react-query'

import Map from '../components/Map'
import Table from '../components/Table'
import { getCountriesData } from '../services/countries'
import { getCountries } from '../services/stats'

export default function Countries() {
  const countriesStats = useQuery(['countries'], getCountries)
  const countriesData = useQuery(['countries-data'], getCountriesData)
  if (
    countriesStats.isError ||
    countriesData.isError ||
    countriesStats.isLoading ||
    countriesData.isLoading
  )
    return <h1>Loading...</h1>

  return (
    <div className="flex">
      <div>
        <Table
          columns={[
            { label: 'Country', key: 'name' },
            {
              label: 'Attempts',
              key: 'population',
              align: 'right',
              format: (x) => x.toLocaleString(),
            },
          ]}
          datas={countriesStats.data}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <Map countries={countriesStats.data} svgData={countriesData.data} />
      </div>
    </div>
  )
}
