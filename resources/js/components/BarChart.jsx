import { map, scaleLinear, scaleBand, axisTop, axisLeft, max, range, InternSet } from 'd3'
import { useRef } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import useD3 from '../hooks/useD3'
import trimLabel from '../utils/trimLabel'

export default function BarChart({
  data,
  x,
  y,
  title,
  marginTop = 30,
  marginRight = 0,
  marginBottom = 30,
  marginLeft = 30,
  xType = scaleLinear,
  xDomain,
  xRange,
  xFormat,
  xLabel,
  yPadding = 0.1,
  yDomain,
  yRange,
  color = 'currentColor',
  titleColor = 'white',
  titleAltColor = 'currentColor',
  height = 400,
}) {
  const { width = 800, ref: widthWatchedRef } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200,
  })

  const ref = useD3(
    (svg) => {
      const X = map(data, x)
      const Y = map(data, y)

      if (xDomain === undefined) xDomain = [0, max(X)]
      if (yDomain === undefined) yDomain = Y
      yDomain = new InternSet(yDomain)

      const I = range(X.length).filter((i) => yDomain.has(Y[i]))

      if (xRange === undefined) xRange = [marginLeft, width - marginRight - marginLeft]
      if (yRange === undefined) yRange = [marginTop, height - marginBottom]

      const xScale = xType(xDomain, xRange).exponent(0.3)
      const yScale = scaleBand(yDomain, yRange).padding(yPadding)
      const xAxis = axisTop(xScale).ticks((width - marginLeft - marginRight) / 160, xFormat)
      const yAxis = axisLeft(yScale).tickSizeOuter(0)

      if (title === undefined) {
        const formatValue = xScale.tickFormat(100, xFormat)
        title = (i) => `${formatValue(X[i])}`
      } else {
        const O = map(data, (d) => d)
        title = (i) => title(O[i], i, data)
      }

      svg
        .select('.x-axis')
        .attr('transform', `translate(0, ${marginTop})`)
        .call(xAxis)
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          g
            .selectAll('.tick line')
            .clone()
            .attr('y2', height - marginTop - marginBottom)
            .attr('stroke-opacity', 0.1)
        )
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('font-size', '1.5em')

      svg
        .select('.plot-area')
        .attr('fill', color)
        .selectAll('rect')
        .data(I)
        .join('rect')
        .attr('x', xScale(0))
        .attr('y', (i) => yScale(Y[i]))
        .attr('width', (i) => xScale(X[i]) - xScale(0))
        .attr('height', yScale.bandwidth())
        .attr('fill', '#2563eb')

      svg
        .select('.smoll')
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
        .attr('font-size', '1.5em')

      svg
        .select('.y-axis')
        .attr('transform', `translate(${marginLeft},0) `)
        .call(yAxis)
        .selectAll('text')
        .attr('title', (i) => `${i}`)
        .html('')
        .append('tspan')
        .text(trimLabel)
        .attr('font-size', '1.5em')
    },
    [data.length, width, height]
  )

  return (
    <div className="flex-1 flex flex-col" ref={widthWatchedRef}>
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        fill="currentColor"
        style={{
          width: `100%`,
          height: `${height}px`,
        }}
      >
        <g className="plot-area" />
        <g className="x-axis" />
        <g className="y-axis" />
        <g className="grid" />
        <g className="smoll" />
      </svg>
    </div>
  )
}
