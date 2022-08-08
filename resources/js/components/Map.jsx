import { select, max, scaleSqrt, mean, pointer } from 'd3'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { useMemo } from 'react'
import { feature } from 'topojson-client'
import { numericToAlpha2 } from 'i18n-iso-countries'
import useD3 from '../hooks/useD3'

const width = 800
const height = 450

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
  const projection = geoNaturalEarth1()
    .scale(160)
    .translate([width / 2, height / 2])
  return geoPath().projection(projection)
}
export default function Map({ countries, svgData }) {
  const featureData = useMemo(
    () =>
      feature(svgData, svgData.objects.countries).features.map((country) => {
        const properties = country.properties
        properties.id = numericToAlpha2(country.id)
        properties.population = countries.find((c) => c.id === properties.id)?.population || 0
        country.properties = properties
        return country
      }),
    [svgData]
  )

  const colorScale = useMemo(() => buildColorScale(countries), [countries])

  const ref = useD3(
    (svg) => {
      const tooltip = select('.tooltip').style('opacity', 0)

      const mouseover = (event, d) => {
        tooltip.style('opacity', 1)
      }

      const mouseleave = (event, d) => {
        tooltip.style('opacity', 0)
      }

      const mousemove = (event, d) => {
        const text = select('.tooltip-area__text')
        text.text(`${d.properties.name}: ${d.properties.population.toLocaleString()}`)
        const [x, y] = pointer(event)

        tooltip.attr('transform', `translate(${x}, ${y})`)
      }

      svg
        .select('.plot-area')
        .selectAll('path')
        .data(featureData)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('id', (d) => d.properties.id)
        .attr('population', (d) => d.properties.population)
        .attr('fill', (d) => {
          return colorScale(d.properties.population)
        })
        .attr('stroke', '#777')
        .attr('stroke-width', '0.5')
        .attr('d', buildGeoPath())
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
        .on('mouseover', mouseover)
    },
    [featureData.length, colorScale]
  )

  return (
    <>
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`}>
        <g className="plot-area" />
        <g className="tooltip bg-gray-900 text-white">
          <text className="tooltip-area__text pointer-events-none">aas</text>
        </g>
      </svg>
    </>
  )
}
