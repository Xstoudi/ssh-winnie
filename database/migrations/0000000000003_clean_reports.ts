import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import knex from 'knex'

export default class extends BaseSchema {
  protected tableName = 'clean_reports'

  public async up() {
    const k = knex({ client: 'postgres' })
    this.schema.createView(this.tableName, (view) => {
      view.as(
        k
          .select({
            id: 'reports.id',
            username: 'reports.username',
            password: 'reports.password',
            remote_addr: 'reports.remote_addr',
            remote_identity: 'reports.remote_identity',
            as_country_code: 'ranges.country_code',
            as_name: 'ranges.name',
            asn: 'ranges.asn',
            host: 'hosts.name',
            created_at: 'reports.created_at',
          })
          .from('reports')
          .innerJoin('ranges', 'reports.id_range', 'ranges.id')
          .innerJoin('hosts', 'reports.id_host', 'hosts.id')
      )
    })
  }

  public async down() {
    this.schema.dropView(this.tableName)
  }
}
