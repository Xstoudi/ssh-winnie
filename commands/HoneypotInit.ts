import { BaseCommand } from '@adonisjs/core/build/standalone'
import axios from 'axios'
import zlib from 'zlib'
import Database from '@ioc:Adonis/Lucid/Database'

const URL = 'https://iptoasn.com/data/ip2asn-v4-u32.tsv.gz'
const BULK_SIZE = 10000

export default class HoneypotInit extends BaseCommand {
  public static commandName = 'honeypot:init'
  public static description = ''

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const { data } = await axios.get(URL, { responseType: 'arraybuffer' })
    const content = zlib.gunzipSync(data).toString()
    const ranges = content
      .split('\n')
      .filter((line) => line.length > 0)
      .map((line) => line.split('\t'))
      .map((range) => {
        const [rangeStart, rangeEnd, asn, countryCode, name] = range
        const rangeStartNumber = parseInt(rangeStart, 10)
        const rangeEndNumber = parseInt(rangeEnd, 10)
        return {
          country_code: countryCode,
          name,
          asn,
          range_start: rangeStartNumber,
          range_end: rangeEndNumber,
        }
      })

    this.logger.log('Loading ranges...')

    while (ranges.length !== 0) {
      const toRemoveCount = ranges.length < BULK_SIZE ? ranges.length : BULK_SIZE
      await Database.table('ranges').multiInsert(
        ranges
          .splice(ranges.length - toRemoveCount, toRemoveCount)
          .filter((range) => range.country_code.length === 2)
      )
      this.logger.logUpdate(`remaining ${ranges.length}`)
    }

    this.logger.log('Done!')
  }
}
