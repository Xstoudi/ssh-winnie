import { select, scaleLinear, scaleBand, axisBottom, axisLeft, max } from 'd3'

export async function barplot(target, data, logarithmic = false) {
  const margin = { top: 50, right: 50, bottom: 50, left: 200 }

  const parentWidth = parseInt(select(target).style('width'), 10)
  const parentHeight = parseInt(select(target).style('width'), 10)

  const width = parentWidth - margin.left - margin.right
  const height = parentHeight - margin.top - margin.bottom

  const svgContainer = select(target)
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${parentWidth} ${parentHeight}`)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .classed('svg-content-responsive', true)

  const svg = svgContainer
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  console.log(data)
  const x = scaleLinear()
    .domain([0, max(data.map((username) => username[1])) || 0])
    .range([0, width])
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(axisBottom(x))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end')

  // Y axis
  const y = scaleBand()
    .range([0, height])
    .domain(
      data.map(function (d) {
        return d[0]
      })
    )
    .padding(0.1)
  svg.append('g').call(axisLeft(y))

  //Bars
  svg
    .selectAll('myRect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', x(0))
    .attr('y', function (d) {
      return y(d[0])
    })
    .attr('width', function (d) {
      return x(d[1])
    })
    .attr('height', y.bandwidth())
    .attr('fill', '#69b3a2')
}
