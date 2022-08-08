import request from '../deps/request'

export function getDashboard() {
  return request({ url: '/stats/dashboard' })
}

export function getCountries() {
  return request({ url: '/stats/countries' })
}

export function getUsernames() {
  return request({ url: '/stats/usernames' })
}

export function getPasswords() {
  return request({ url: '/stats/passwords' })
}

export function getIdentities() {
  return request({ url: '/stats/identities' })
}

export function getAS() {
  return request({ url: '/stats/autonomous-systems/names' })
}
