import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import { CountryCount, generateMap } from 'App/Graph/Map'

import { getName } from 'i18n-iso-countries'

Route.get('/', async ({ view, logger }: HttpContextContract) => {
  const countriesCount: CountryCount[] = (
    await Database.from('clean_reports')
      .select('as_country_code')
      .count('as_country_code as population')
      .groupBy('as_country_code')
      .orderBy('population', 'desc')
  ).map((country) => ({
    population: Number(country.population),
    id: country.as_country_code,
    name: getName(country.as_country_code, 'en'),
  }))

  const usernameCount: any = (
    await Database.from('clean_reports')
      .select('username')
      .count('username as population')
      .groupBy('username')
      .orderBy('population', 'desc')
  ).map((usernameRow) => ({
    username: usernameRow.username,
    population: Number(usernameRow.population),
  }))

  return view.render('home', {
    map: await generateMap(countriesCount),
    mapData: countriesCount,
  })
})
