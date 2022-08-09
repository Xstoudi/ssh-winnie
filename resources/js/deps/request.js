import axios from 'axios'

const localClient = axios.create({
  baseURL: `http://localhost:3333`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 2000,
})

const localRequest = async function (options) {
  const onSuccess = function (response) {
    const { data } = response
    return data
  }

  const onError = function (error) {
    return Promise.reject(error.response)
  }

  return localClient(options).then(onSuccess, onError)
}

const externalClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 2000,
})

const externalRequest = async function (options) {
  const onSuccess = function (response) {
    const { data } = response
    return data
  }

  const onError = function (error) {
    return Promise.reject(error.response)
  }

  return externalClient(options).then(onSuccess, onError)
}

export { externalRequest }
export default localRequest
