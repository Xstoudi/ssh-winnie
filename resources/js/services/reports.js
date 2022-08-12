import request from '../deps/request'
export function getReports(page, address, identity, country, asName, asn, host) {
  if (address === '') address = undefined
  if (identity === '') identity = undefined
  if (country === '') country = undefined
  if (asName === '') asName = undefined
  if (asn === 0) asn = undefined
  if (host === '') host = undefined
  return request({
    url: `/stats/reports`,
    params: { page, address, identity, country, asName, asn, host },
  })
}
