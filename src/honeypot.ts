import 'dotenv/config'
import { existsSync, readFileSync, writeFileSync, writeSync } from 'fs'
import { PasswordAuthContext, Server } from 'ssh2'
import keygen from 'ssh-keygen-lite'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { toInt } from './IpToInt'

import findASN from './IpToAsn'

const KEY_NAME = 'host'
const SHEET_ID = process.env.SHEET_ID

interface AuthData {
  username: string
  password: string | null
  key: string | null
}

const doc = new GoogleSpreadsheet(SHEET_ID)

async function getOrGenerateKeyPair() {
  if (!existsSync(`${KEY_NAME}`)) {
    const key = await keygen({
      type: 'rsa',
      location: KEY_NAME,
      size: '2048',
      format: 'PEM',
    })
  }
  return readFileSync(KEY_NAME)
}

async function googleAuth() {
  await doc.useServiceAccountAuth({
    client_email: process.env.SHEET_CLIENT_EMAIL ?? '',
    private_key: Buffer.from(
      process.env.SHEET_PRIVATE_KEY ?? '',
      'base64'
    ).toString('ascii'),
  })

  await doc.loadInfo()
}

async function runServer() {
  new Server(
    {
      hostKeys: [await getOrGenerateKeyPair()],
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

          const asn = findASN(toInt(remoteAddr))

          doc.sheetsByTitle[process.env.SHEET_NAME ?? 'data']
            .addRow({
              datetime: new Date().toISOString(),
              username: `${username}`,
              password: `${password}`,
              remoteAddr: `${remoteAddr}`,
              remoteIdent: `${remoteIdent}`,
              asnCountry: `${asn?.country ?? 'WTF'}`,
              asnName: `${asn?.name ?? 'WTF'}`,
              asnId: `AS${asn?.asn ?? 'WTF'}`,
            })
            .then((sheet) => sheet.save())

          ctx.reject(['password'])
        })
        .on('ready', () => {
          client.on('session', (accept, reject) => {
            const session = accept()
            session.once('pty', (accept, reject, info) => {
              accept()
            })
            session.on('shell', (accept, reject) => {
              const stream = accept()
              stream.write('Eat my shiny ass!\r\n')
            })
          })
        })
        .on('error', (err) => {
          console.log('error occured', err.message)
        })
    }
  ).listen(Number(process.env.PORT), '0.0.0.0', () => {
    console.log(`Winnie listening on port ${process.env.PORT}`)
  })
}

;(async () => {
  await googleAuth()
  await runServer()
})()
