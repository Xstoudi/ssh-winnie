import { externalRequest } from '../deps/request'

export function getCountriesData() {
  return externalRequest({ url: 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json' })
}
