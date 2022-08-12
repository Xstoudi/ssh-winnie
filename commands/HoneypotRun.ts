import { BaseCommand } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import { existsSync, readFileSync } from 'fs'
import { PasswordAuthContext, Server } from 'ssh2'
import keygen from 'ssh-keygen-lite'
import knex from 'knex'
import axios from 'axios'

const k = knex({ client: 'postgres' })

const REGEXP_IP =
  /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/

let winnieId = null

const alreadyReportedCache = []

export default class HoneypotRun extends BaseCommand {
  public static commandName = 'honeypot:run'
  public static description = ''

  public static settings = {
    loadApp: true,
    stayAlive: true,
  }

  public async run() {
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
            const ipInt = this.toInt(remoteAddr)

            const asnPromise = Database.query()
              .from('ranges')
              .select('id')
              .where('range_start', '<=', ipInt)
              .andWhere('range_end', '>=', ipInt)
              .firstOrFail()
              .catch(() => {
                console.log(`${remoteAddr} is not in any range`)
                return client.end()
              })

            asnPromise.then((asn) =>
              Database.table('reports').insert({
                username: `${username}`,
                password: `${password}`,
                remote_addr: `${remoteAddr}`,
                remote_identity: `${remoteIdent}`,
                id_range: asn.id,
                id_host: winnieId,
                created_at: k.fn.now(),
              })
            )

            if (Env.get('ABUSEIP_API_KEY'))
              asnPromise.then(() => {
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
                    console.log(`Error while reporting to abuseip, ${JSON.stringify(err.toJSON())}`)
                  )
                }
              })

            asnPromise
              .catch((err) => {
                throw err
              })
              .finally(() => ctx.reject(['password']))
          })
          .on('error', (err) => {
            console.log('error occured', err.message)
          })
      }
    ).listen(Number(Env.get('SSH_PORT')), '0.0.0.0', () => {
      console.log(`Winnie listening on port ${Env.get('SSH_PORT')}`)
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

  private toInt(ip: string): number {
    if (!ip) {
      throw new Error('E_UNDEFINED_IP')
    }

    if (!REGEXP_IP.test(ip)) {
      throw new Error('E_INVALID_IP')
    }

    return ip
      .split('.')
      .map((octet, index, array) => {
        return parseInt(octet) * Math.pow(256, array.length - index - 1)
      })
      .reduce((prev, curr) => {
        return prev + curr
      })
  }
}
