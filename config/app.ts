import proxyAddr from 'proxy-addr'
import Env from '@ioc:Adonis/Core/Env'
import { ServerConfig } from '@ioc:Adonis/Core/Server'
import { LoggerConfig } from '@ioc:Adonis/Core/Logger'
import { ProfilerConfig } from '@ioc:Adonis/Core/Profiler'
import { ValidatorConfig } from '@ioc:Adonis/Core/Validator'
import { AssetsManagerConfig } from '@ioc:Adonis/Core/AssetsManager'
import Application from '@ioc:Adonis/Core/Application'

export const appKey: string = Env.get('APP_KEY')

export const http: ServerConfig = {
  allowMethodSpoofing: false,
  subdomainOffset: 2,
  generateRequestId: false,
  trustProxy: proxyAddr.compile('loopback'),
  etag: false,
  jsonpCallbackName: 'callback',
  cookie: {
    domain: '',
    path: '/',
    maxAge: '2h',
    httpOnly: true,
    secure: false,
    sameSite: false,
  },
}

export const logger: LoggerConfig = {
  name: Env.get('APP_NAME'),
  enabled: true,
  level: Env.get('LOG_LEVEL', 'info'),
  prettyPrint: Env.get('NODE_ENV') === 'development',
}

export const profiler: ProfilerConfig = {
  enabled: true,
  blacklist: [],
  whitelist: [],
}

export const validator: ValidatorConfig = {}

export const assets: AssetsManagerConfig = {
  driver: 'encore',
  publicPath: Application.publicPath('assets'),

  script: {
    attributes: {
      defer: true,
    },
  },

  style: {
    attributes: {},
  },
}
