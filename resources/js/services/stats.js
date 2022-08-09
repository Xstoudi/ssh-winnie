import request from '../deps/request'

function addQueryParam(hostId = '-1') {
  return hostId === '-1' ? '' : `?host=${hostId}`
}

export function getDashboard(hostId) {
  return () => {
    return request({ url: `/stats/dashboard${addQueryParam(hostId)}` })
  }
}

export function getCountries(hostId) {
  return () => request({ url: `/stats/countries${addQueryParam(hostId)}` })
}

export function getUsernames(hostId) {
  return () => request({ url: `/stats/usernames${addQueryParam(hostId)}` })
}

export function getPasswords(hostId) {
  return () => request({ url: `/stats/passwords${addQueryParam(hostId)}` })
}

export function getIdentities(hostId) {
  return () => request({ url: `/stats/identities${addQueryParam(hostId)}` })
}

export function getAS(hostId) {
  return () => request({ url: `/stats/autonomous-systems/names${addQueryParam(hostId)}` })
}

export function getHosts() {
  return request({ url: '/stats/hosts' })
}
