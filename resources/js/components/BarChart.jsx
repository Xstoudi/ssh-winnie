import {
  groupSort,
  map,
  select,
  scaleLinear,
  scaleBand,
  axisTop,
  axisLeft,
  max,
  range,
  InternSet,
} from 'd3'
import useD3 from '../hooks/useD3'

const width = 800
const height = 400

function trimLabel(label) {
  return label.length >= 20 ? `${label.slice(0, 17)}...` : label
}

export default function BarChart({
  data,
  x,
  y,
  title,
  marginTop = 30,
  marginRight = 0,
  marginBottom = 10,
  marginLeft = 30,
  xType = scaleLinear,
  xDomain,
  xRange = [marginLeft, width - marginRight],
  xFormat,
  xLabel,
  yPadding = 0.1,
  yDomain,
  yRange,
  color = 'currentColor',
  titleColor = 'white',
  titleAltColor = 'currentColor',
}) {
  const ref = useD3(
    (svg) => {
      const X = map(data, x)
      const Y = map(data, y)

      if (xDomain === undefined) xDomain = [0, max(X)]
      if (yDomain === undefined) yDomain = Y
      yDomain = new InternSet(yDomain)

      const I = range(X.length).filter((i) => yDomain.has(Y[i]))

      if (height === undefined)
        height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom
      if (yRange === undefined) yRange = [marginTop, height - marginBottom]

      const xScale = xType(xDomain, xRange)
      const yScale = scaleBand(yDomain, yRange).padding(yPadding)
      const xAxis = axisTop(xScale).ticks(width / 80, xFormat)
      const yAxis = axisLeft(yScale).tickSizeOuter(0)

      if (title === undefined) {
        const formatValue = xScale.tickFormat(100, xFormat)
        title = (i) => `${formatValue(X[i])}`
      } else {
        const O = d3.map(data, (d) => d)
        const T = title
        title = (i) => T(O[i], i, data)
      }

      select('.x-axis')
        .attr('transform', `translate(0,${marginTop})`)
        .call(xAxis)
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          g
            .selectAll('.tick line')
            .clone()
            .attr('y2', height - marginTop - marginBottom)
            .attr('stroke-opacity', 0.1)
        )
        .call((g) =>
          g
            .append('text')
            .attr('x', width - marginRight)
            .attr('y', -22)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'end')
            .text(xLabel)
        )

      select('.plot-area')
        .attr('fill', color)
        .selectAll('rect')
        .data(I)
        .join('rect')
        .attr('x', xScale(0))
        .attr('y', (i) => yScale(Y[i]))
        .attr('width', (i) => xScale(X[i]) - xScale(0))
        .attr('height', yScale.bandwidth())

      select('.y-axis')
        .attr('fill', titleColor)
        .attr('text-anchor', 'end')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .selectAll('text')
        .data(I)
        .join('text')
        .attr('x', (i) => xScale(X[i]))
        .attr('y', (i) => yScale(Y[i]) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('dx', -4)
        .text(title)
        .call((text) =>
          text
            .filter((i) => xScale(X[i]) - xScale(0) < 20) // short bars
            .attr('dx', +4)
            .attr('fill', titleAltColor)
            .attr('text-anchor', 'start')
        )

      select('.y-axis').attr('transform', `translate(${marginLeft},0)`).call(yAxis)
    },
    [data.length]
  )

  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} fill="currentColor">
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
      <g className="grid" />
    </svg>
  )
}
