import {
  select,
  json,
  geoPath,
  geoMercator,
  max,
  scaleSqrt,
  ScaleContinuousNumeric,
  mean,
} from 'd3'
import { feature } from 'topojson-client'
import { numericToAlpha2 } from 'i18n-iso-countries'
import { JSDOM } from 'jsdom'
import { Selection } from 'd3-selection'

export interface CountryCount {
  population: number
  id: string
  name: string
}

function buildColorScale(countries: CountryCount[]) {
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

function buildContainer() {
  const fakeDom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
  const body = select(fakeDom.window.document).select('body')
  const svg = body.append('svg').attr('viewBox', '0 0 960 580')
  svg.append('path').attr('class', 'sphere')

  return { container: body, svg }
}

async function svgDatas(countries: CountryCount[]) {
  const data: any = await json('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
  return (feature(data, data.objects.countries) as any).features.map((country: any) => {
    const properties = country.properties
    properties.id = numericToAlpha2(country.id)
    properties.population = countries.find((c) => c.id === properties.id)?.population || 0
    country.properties = properties
    return country
  })
}

async function drawMap(
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  svgCountries: any,
  colorScale: ScaleContinuousNumeric<string, string, never>
) {
  svg
    .selectAll('path')
    .data(svgCountries)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('id', (d: any) => d.properties.id)
    .attr('population', (d: any) => d.properties.population)
    .attr('fill', (d: any) => {
      return colorScale(d.properties.population)
    })
    .attr('d', buildGeoPath())
}

export async function generateMap(data: CountryCount[]) {
  const { container, svg } = buildContainer()

  const colorScale = buildColorScale(data)
  const svgCountries = await svgDatas(data)

  await drawMap(svg, svgCountries, colorScale)

  return container.html()
}
