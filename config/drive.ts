import { driveConfig } from '@adonisjs/core/build/config'
import Application from '@ioc:Adonis/Core/Application'

export default driveConfig({
  disk: 'local',
  disks: {
    local: {
      driver: 'local',
      visibility: 'public',
      root: Application.tmpPath('uploads'),
      serveFiles: true,
      basePath: '/uploads',
    },
  },
})
