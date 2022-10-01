import { BaseCommand } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import { existsSync, readFileSync } from 'fs'
import { PasswordAuthContext, Server } from 'ssh2'
import keygen from 'ssh-keygen-lite'
import knex from 'knex'
import axios from 'axios'
import maxmind, { AsnResponse, CountryResponse, Reader } from 'maxmind'

const k = knex({ client: 'postgres' })

let winnieId = null

const alreadyReportedCache = []

export default class HoneypotRun extends BaseCommand {
  public static commandName = 'honeypot:run'
  public static description = ''

  private countryLookup: Reader<CountryResponse>
  private asnLookup: Reader<AsnResponse>

  public static settings = {
    loadApp: true,
    stayAlive: true,
  }

  public async run() {
    const geolite2: typeof import('geolite2-redist') = await Function(
      'return import("geolite2-redist")'
    )()

    this.countryLookup = await geolite2.open(geolite2.GeoIpDbName.Country, (dbPath) =>
      maxmind.open(dbPath)
    )
    this.asnLookup = await geolite2.open(geolite2.GeoIpDbName.ASN, (dbPath) => maxmind.open(dbPath))

    await this.setup()
    this.runServer()
  }

  private async setup() {
    const host = await Database.query().from('hosts').where('name', Env.get('WINNIE_NAME')).limit(1)
    if (host.length === 0) {
      winnieId = (
        await Database.table('hosts')
          .insert({ name: Env.get('WINNIE_NAME') })
          .returning(['id'])
      )[0].id
      return
    }
    winnieId = host[0].id
  }

  private async runServer() {
    const SSH_HOST = Env.get('SSH_HOST', '0.0.0.0')
    new Server(
      {
        hostKeys: [await this.getOrGenerateKeyPair()],
        ident: Env.get('SSH_IDENTITY'),
      },
      (client, clientInfo) => {
        client
          .on('authentication', (ctx) => {
            const username = ctx.username
            if (ctx.method !== 'password') {
              ctx.reject(['password'])
              return
            }

            const password = (ctx as unknown as PasswordAuthContext).password
            const remoteAddr = clientInfo.ip
            const remoteIdent = clientInfo.header.identRaw

            const country = this.countryLookup.get(remoteAddr)
            const asn = this.asnLookup.get(remoteAddr)

            const basePromise = Promise.resolve(1)

            basePromise.then(() =>
              Database.table('reports').insert({
                username: `${username}`,
                password: `${password}`,
                remote_addr: `${remoteAddr}`,
                remote_identity: `${remoteIdent}`,
                country_code: country?.country?.iso_code ? country?.country?.iso_code : null,
                as_name: asn?.autonomous_system_organization
                  ? asn?.autonomous_system_organization
                  : null,
                asn: asn?.autonomous_system_number ? asn?.autonomous_system_number : null,
                id_host: winnieId,
                created_at: k.fn.now(),
              })
            )

            if (Env.get('ABUSEIP_API_KEY'))
              basePromise.then(() => {
                Object.keys(alreadyReportedCache).forEach((key) => {
                  if (Date.now() - alreadyReportedCache[key] > 30 * 60 * 1000) {
                    delete alreadyReportedCache[key]
                  }
                })

                if (alreadyReportedCache[remoteAddr] === undefined) {
                  alreadyReportedCache[remoteAddr] = Date.now()
                  return axios('https://api.abuseipdb.com/api/v2/report', {
                    method: 'POST',
                    params: {
                      ip: remoteAddr,
                      categories: '18,22',
                      comment: `SSH login attempt. Reported by ssh-winnie.`,
                    },
                    headers: {
                      key: Env.get('ABUSEIP_API_KEY'),
                    },
                    validateStatus: (status) => status >= 200 && status < 400,
                  }).catch((err) =>
                    this.logger.error(
                      `Error while reporting to abuseip, ${JSON.stringify(err.toJSON())}`
                    )
                  )
                }
              })

            basePromise
              .catch((err) => {
                throw err
              })
              .finally(() => ctx.reject(['password']))
          })
          .on('error', (err) => {
            this.logger.error(err)
          })
      }
    ).listen(Number(Env.get('SSH_PORT')), SSH_HOST, () => {
      this.logger.info(`Winnie listening on ${SSH_HOST}:${Env.get('SSH_PORT')}`)
    })
  }

  private async getOrGenerateKeyPair() {
    const keyName = 'host'
    if (!existsSync(keyName)) {
      await keygen({
        type: 'rsa',
        location: keyName,
        size: '2048',
        format: 'PEM',
      })
    }
    return readFileSync(keyName)
  }
}
