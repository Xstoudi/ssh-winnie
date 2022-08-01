import axios from 'axios'
import { select, json, geoPath, geoMercator, max, scaleSqrt, mean } from 'd3'
import { feature } from 'topojson-client'
import { numericToAlpha2 } from 'i18n-iso-countries'

function buildContainer() {
  const map = select('div.map')
  const svg = map.append('svg').attr('viewBox', '0 0 960 580')
  svg.append('path').attr('class', 'sphere')

  return { container: map, svg }
}

function buildColorScale(countries) {
  return scaleSqrt(
    [
      0,
      1,
      mean(countries.map((country) => country.population)) || 0,
      max(countries.map((country) => country.population)) || 0,
    ],
    ['#f5f5f5', '#f4c0b6', '#f17b6c', '#b33656']
  )
}

function buildGeoPath() {
  const projection = geoMercator()
  return geoPath().projection(projection)
}

async function svgDatas(countries) {
  const data = await json('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
  return feature(data, data.objects.countries).features.map((country) => {
    const properties = country.properties
    properties.id = numericToAlpha2(country.id)
    properties.population = countries.find((c) => c.id === properties.id)?.population || 0
    country.properties = properties
    return country
  })
}

function createTable(data) {
  const columns = [
    ['Country', 'name'],
    ['Population', 'population'],
  ]
  const table = select('table.map-data')
  const thead = table.append('thead')
  const tbody = table.append('tbody')
  const tfoot = table.append('tfoot')

  thead
    .append('tr')
    .selectAll('th')
    .data(columns.map((column) => column[0]))
    .enter()
    .append('th')
    .text(function (column) {
      return column
    })

  const rows = tbody.selectAll('tr').data(data).enter().append('tr')

  const cells = rows
    .selectAll('td')
    .data((row) => columns.map(([label, key]) => ({ column: key, value: row[key] })))
    .enter()
    .append('td')
    .text((d) => d.value)

  const totalRow = tfoot.append('tr')
  totalRow.append('td').text('Total')
  totalRow.append('td').text(data.reduce((acc, country) => acc + country.population, 0))

  return table
}

async function drawMap(svg, svgCountries, colorScale) {
  svg
    .selectAll('path')
    .data(svgCountries)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('id', (d) => d.properties.id)
    .attr('population', (d) => d.properties.population)
    .attr('fill', (d) => {
      return colorScale(d.properties.population)
    })
    .attr('d', buildGeoPath())
}

export async function generateMap() {
  const { container, svg } = buildContainer()

  const { data: countriesData } = await axios(`/countries`)

  const colorScale = buildColorScale(countriesData)
  const svgCountries = await svgDatas(countriesData)

  await drawMap(svg, svgCountries, colorScale)
  createTable(countriesData)
}
