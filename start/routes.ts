import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }: HttpContextContract) => {
  return view.render('home')
})

Route.get('/countries', 'StatsController.countries')
Route.get('/usernames', 'StatsController.usernames')
Route.get('/passwords', 'StatsController.passwords')
Route.get('/identities', 'StatsController.identities')
Route.get('/autonomous-systems/names', 'StatsController.asNames')
