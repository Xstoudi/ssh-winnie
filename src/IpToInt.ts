const regexIP =
  /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/

export function toInt(ip: string): number {
  if (!ip) {
    throw new Error('E_UNDEFINED_IP')
  }

  if (!regexIP.test(ip)) {
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
