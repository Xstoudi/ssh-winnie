import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { getName } from 'i18n-iso-countries'
import { DateTime, Interval } from 'luxon'
import { Stringifier } from 'csv-stringify'

const PER_PAGE = 20

export default class StatsController {
  public async usernames({ request }: HttpContextContract) {
    const maybeHostId = request.qs().host

    const query = Database.from('reports')
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

    const query = Database.from('reports')
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

    const query = Database.from('reports')
      .select('country_code')
      .count('country_code as population')
      .groupBy('country_code')
      .orderBy('population', 'desc')

    if (maybeHostId !== undefined) {
      query.where('id_host', maybeHostId)
    }

    return (await query).map((country) => ({
      population: Number(country.population),
      id: country.country_code,
      name: getName(country.country_code, 'en'),
    }))
  }

  public async asNames({ request }: HttpContextContract) {
    const maybeHostId = request.qs().host

    const query = Database.from('reports')
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

    const query = Database.from('reports')
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

    const lastMinuteInterval = Interval.before(DateTime.now(), { minute: 1 })
    const lastHourInterval = Interval.before(DateTime.now(), { hour: 1 })
    const lastDayInterval = Interval.before(DateTime.now(), { day: 1 })

    const queries = [
      Database.from('reports').count('* as population'),
      Database.from('reports').countDistinct('country_code as population'),
      Database.from('reports').countDistinct('username as population'),
      Database.from('reports').countDistinct('password as population'),
      Database.from('reports').countDistinct('as_name as population'),
      Database.from('reports').countDistinct('remote_identity as population'),
      Database.from('reports')
        .count('* as population')
        .whereBetween('created_at', [
          lastMinuteInterval.start.toSQL(),
          lastMinuteInterval.end.toSQL(),
        ]),
      Database.from('reports')
        .count('* as population')
        .whereBetween('created_at', [lastHourInterval.start.toSQL(), lastHourInterval.end.toSQL()]),
      Database.from('reports')
        .count('* as population')
        .whereBetween('created_at', [lastDayInterval.start.toSQL(), lastDayInterval.end.toSQL()]),
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
      lastMinuteAttempts: await stats[6].population,
      lastHourAttempts: await stats[7].population,
      lastDayAttempts: await stats[8].population,
    }
  }

  public async hosts(_ctx: HttpContextContract) {
    return Database.from('hosts').select('*')
  }

  public async reports({ request }: HttpContextContract) {
    const { address, identity, country, asName, asn, host, page = 0 } = request.qs()

    const query = Database.from('clean_reports')

    if (address !== undefined) query.whereLike('remote_addr', `%${address}%`)
    if (identity !== undefined) query.whereLike('remote_identity', `%${identity}%`)
    if (country !== undefined) query.whereLike('country_code', `%${country}%`)
    if (asName !== undefined) query.whereLike('as_name', `%${asName}%`)
    if (asn !== undefined) query.whereLike('asn', `%${asn}%`)
    if (host !== undefined) query.whereLike('host', `%${host}%`)

    return query.paginate(page, PER_PAGE)
  }

  public async exportReports({ request, response }: HttpContextContract) {
    const { address, identity, country, asName, asn, host } = request.qs()

    const query = Database.from('clean_reports')
    if (address !== undefined) query.whereLike('remote_addr', `%${address}%`)
    if (identity !== undefined) query.whereLike('remote_identity', `%${identity}%`)
    if (country !== undefined) query.whereLike('country_code', `%${country}%`)
    if (asName !== undefined) query.whereLike('as_name', `%${asName}%`)
    if (asn !== undefined) query.whereLike('asn', `%${asn}%`)
    if (host !== undefined) query.whereLike('host', `%${host}%`)

    response.header('Content-Type', 'text/csv')
    response.header('Content-Disposition', 'attachment; filename="reports.csv"')

    const csv = new Stringifier({
      header: true,
      columns: {
        id: 'id',
        username: 'username',
        password: 'password',
        remote_addr: 'remote_addr',
        remote_identity: 'remote_identity',
        id_range: 'id_range',
        country_code: 'country_code',
        as_name: 'as_name',
        asn: 'asn',
        host: 'host',
        created_at: 'created_at',
      },
    })

    query.toSQL() // FIXME: https://github.com/adonisjs/lucid/issues/865
    return response.stream(query.knexQuery.stream().pipe(csv))
  }
}
