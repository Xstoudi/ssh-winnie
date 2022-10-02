import Database from '@ioc:Adonis/Lucid/Database'

export default class DownloadsController {
  public async usernames() {
    return (
      await Database.from('reports')
        .select(Database.raw('ARRAY_AGG(DISTINCT username) as usernames'))
        .first()
    ).usernames
  }

  public async passwords() {
    return (
      await Database.from('reports')
        .select(Database.raw('ARRAY_AGG(DISTINCT password) as passwords'))
        .first()
    ).passwords
  }

  public async remotes() {
    return (
      await Database.from('reports')
        .select(Database.raw('ARRAY_AGG(DISTINCT remote_addr) as remotes'))
        .first()
    ).remotes
  }
}
