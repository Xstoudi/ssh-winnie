export interface UsernameCount {
  username: string
  population: number
}

export async function generateBarPlot(data: UsernameCount[]) {
  const { container, svg } = buildContainer()

  const colorScale = buildColorScale(data)
  const svgCountries = await svgDatas(data)

  await drawMap(svg, svgCountries, colorScale)

  return container.html()
}
