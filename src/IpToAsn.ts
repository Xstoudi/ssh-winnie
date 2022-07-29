import { readFileSync } from 'fs'

const ranges = readFileSync('ip2asn-v4-u32.tsv', 'utf8')
  .split('\n')
  .map((line) => line.split('\t'))
  .map(([start, end, asn, country, name]) => ({
    start: Number(start),
    end: Number(end),
    asn,
    country,
    name,
  }))

console.log(`Loaded ${ranges.length} IP ranges`)

export default function findASN(ip: number) {
  return ranges.filter((range) => ip >= range.start && ip <= range.end)[0]
}
