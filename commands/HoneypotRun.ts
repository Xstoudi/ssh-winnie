import { BaseCommand } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import { existsSync, readFileSync } from 'fs'
import { PasswordAuthContext, Server } from 'ssh2'
import keygen from 'ssh-keygen-lite'
import knex from 'knex'

const k = knex({ client: 'postgres' })

const REGEXP_IP =
  /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/

let winnieId = null

export default class HoneypotRun extends BaseCommand {
  public static commandName = 'honeypot:run'
  public static description = ''

  public static settings = {
    loadApp: true,
    stayAlive: true,
  }

  public async run() {
    this.setup()
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
            const ipInt = 211549958 //this.toInt(remoteAddr)

            Database.query()
              .from('ranges')
              .select('id')
              .where('range_start', '<=', ipInt)
              .andWhere('range_end', '>=', ipInt)
              .first()
              .then((asn) => {
                if (asn === null) {
                  return client.end()
                }

                Database.table('reports')
                  .insert({
                    username: `${username}`,
                    password: `${password}`,
                    remote_addr: `${remoteAddr}`,
                    remote_identity: `${remoteIdent}`,
                    id_range: asn.id,
                    id_host: winnieId,
                    created_at: k.fn.now(),
                  })
                  .finally(() => ctx.reject(['password']))
              })
              .catch((err) => {
                throw err
              })
          })
          .on('error', (err) => {
            console.log('error occured', err.message)
          })
      }
    ).listen(Number(Env.get('PORT')), '0.0.0.0', () => {
      console.log(`Winnie listening on port ${Env.get('PORT')}`)
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
