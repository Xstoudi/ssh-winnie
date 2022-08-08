import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { getName } from 'i18n-iso-countries'

export default class StatsController {
  public async usernames(ctx: HttpContextContract) {
    return (
      await Database.from('clean_reports')
        .select('username')
        .count('username as population')
        .groupBy('username')
        .orderBy('population', 'desc')
        .limit(20)
    ).map((entryRow) => ({
      population: Number(entryRow.population),
      username: entryRow.username,
    }))
  }

  public async passwords(ctx: HttpContextContract) {
    return (
      await Database.from('clean_reports')
        .select('password')
        .count('password as population')
        .groupBy('password')
        .orderBy('population', 'desc')
        .limit(20)
    ).map((entryRow) => ({
      population: Number(entryRow.population),
      password: entryRow.password,
    }))
  }

  public async countries(ctx: HttpContextContract) {
    return (
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
  }

  public async asNames(ctx: HttpContextContract) {
    return (
      await Database.from('clean_reports')
        .select('as_name')
        .count('as_name as population')
        .groupBy('as_name')
        .orderBy('population', 'desc')
        .limit(20)
    ).map((entryRow) => ({
      population: Number(entryRow.population),
      asName: entryRow.as_name,
    }))
  }

  public async identities(ctx: HttpContextContract) {
    return (
      await Database.from('clean_reports')
        .select('remote_identity')
        .count('remote_identity as population')
        .groupBy('remote_identity')
        .orderBy('population', 'desc')
        .limit(20)
    ).map((entryRow) => ({
      population: Number(entryRow.population),
      remoteIdentity: entryRow.remote_identity,
    }))
  }

  public async dashboard(ctx: HttpContextContract) {
    const stats = await Promise.all([
      Database.from('clean_reports').count('* as population').first(),
      Database.from('clean_reports').countDistinct('as_country_code as population').first(),
      Database.from('clean_reports').countDistinct('username as population').first(),
      Database.from('clean_reports').countDistinct('password as population').first(),
      Database.from('clean_reports').countDistinct('as_name as population').first(),
      Database.from('clean_reports').countDistinct('remote_identity as population').first(),
    ])

    return {
      attempts: await stats[0].population,
      countries: await stats[1].population,
      usernames: await stats[2].population,
      passwords: await stats[3].population,
      asNames: await stats[4].population,
      remoteIdentities: await stats[5].population,
    }
  }
}
