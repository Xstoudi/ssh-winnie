import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/dashboard', 'StatsController.dashboard')
  Route.get('/countries', 'StatsController.countries')
  Route.get('/usernames', 'StatsController.usernames')
  Route.get('/passwords', 'StatsController.passwords')
  Route.get('/identities', 'StatsController.identities')
  Route.get('/autonomous-systems/names', 'StatsController.asNames')
  Route.get('/hosts', 'StatsController.hosts')
  Route.get('/reports', 'StatsController.reports')
  Route.get('/reports/export', 'StatsController.exportReports')
}).prefix('/stats')

Route.get('*', async ({ view }: HttpContextContract) => {
  return view.render('home')
})
