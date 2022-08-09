import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { getName } from 'i18n-iso-countries'

export default class StatsController {
  public async usernames({ request }: HttpContextContract) {
    const maybeHostId = request.qs().host

    const query = Database.from('clean_reports')
      .select('username')
      .count('username as population')
      .groupBy('username')
      .orderBy('population', 'desc')
      .limit(20)

    if (maybeHostId !== undefined) {
      query.where('id_host', maybeHostId)
    }

    return (await query).map((entryRow) => ({
      population: Number(entryRow.population),
      username: entryRow.username,
    }))
  }

  public async passwords({ request }: HttpContextContract) {
    const maybeHostId = request.qs().host

    const query = Database.from('clean_reports')
      .select('password')
      .count('password as population')
      .groupBy('password')
      .orderBy('population', 'desc')
      .limit(20)

    if (maybeHostId !== undefined) {
      query.where('id_host', maybeHostId)
    }

    return (await query).map((entryRow) => ({
      population: Number(entryRow.population),
      password: entryRow.password,
    }))
  }

  public async countries({ request }: HttpContextContract) {
    const maybeHostId = request.qs().host

    const query = Database.from('clean_reports')
      .select('as_country_code')
      .count('as_country_code as population')
      .groupBy('as_country_code')
      .orderBy('population', 'desc')

    if (maybeHostId !== undefined) {
      query.where('id_host', maybeHostId)
    }

    return (await query).map((country) => ({
      population: Number(country.population),
      id: country.as_country_code,
      name: getName(country.as_country_code, 'en'),
    }))
  }

  public async asNames({ request }: HttpContextContract) {
    const maybeHostId = request.qs().host

    const query = Database.from('clean_reports')
      .select('as_name')
      .count('as_name as population')
      .groupBy('as_name')
      .orderBy('population', 'desc')
      .limit(20)

    if (maybeHostId !== undefined) {
      query.where('id_host', maybeHostId)
    }

    return (await query).map((entryRow) => ({
      population: Number(entryRow.population),
      asName: entryRow.as_name,
    }))
  }

  public async identities({ request }: HttpContextContract) {
    const maybeHostId = request.qs().host

    const query = Database.from('clean_reports')
      .select('remote_identity')
      .count('remote_identity as population')
      .groupBy('remote_identity')
      .orderBy('population', 'desc')
      .limit(20)

    if (maybeHostId !== undefined) {
      query.where('id_host', maybeHostId)
    }

    return (await query).map((entryRow) => ({
      population: Number(entryRow.population),
      remoteIdentity: entryRow.remote_identity,
    }))
  }

  public async dashboard({ request }: HttpContextContract) {
    const maybeHostId = request.qs().host

    const queries = [
      Database.from('clean_reports').count('* as population'),
      Database.from('clean_reports').countDistinct('as_country_code as population'),
      Database.from('clean_reports').countDistinct('username as population'),
      Database.from('clean_reports').countDistinct('password as population'),
      Database.from('clean_reports').countDistinct('as_name as population'),
      Database.from('clean_reports').countDistinct('remote_identity as population'),
    ].map((query) => {
      if (maybeHostId !== undefined) {
        query.where('id_host', maybeHostId)
      }

      return query.first()
    })

    const stats = await Promise.all(queries)

    return {
      attempts: await stats[0].population,
      countries: await stats[1].population,
      usernames: await stats[2].population,
      passwords: await stats[3].population,
      asNames: await stats[4].population,
      remoteIdentities: await stats[5].population,
    }
  }

  public async hosts(ctx: HttpContextContract) {
    return Database.from('hosts').select('*')
  }
}
