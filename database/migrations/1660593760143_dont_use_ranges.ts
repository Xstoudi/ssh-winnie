import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  public async up() {
    this.schema.renameTable(this.tableName, 'old_reports')
    this.schema.createTable(this.tableName, (table) => {
      table.dropIndex('remote_addr')
      table.increments('id')

      table.string('username', 32).notNullable()
      table.string('password', 255).notNullable()
      table.string('remote_addr', 15).notNullable().index()
      table.string('remote_identity', 255).notNullable()
      table.integer('id_host').unsigned().references('id').inTable('hosts').notNullable()
      table.string('country_code', 2).nullable()
      table.string('as_name', 255).nullable()
      table.integer('asn', 10).nullable()
      table.timestamp('created_at', { useTz: true })
    })

    this.defer(async (db) => {
      const oldDatas = await db
        .from('old_reports')
        .select()
        .innerJoin('ranges', 'old_reports.id_range', 'ranges.id')

      await Promise.all(
        oldDatas.map((elem) =>
          db.table(this.tableName).insert({
            username: elem.username,
            password: elem.password,
            remote_addr: elem.remote_addr,
            remote_identity: elem.remote_identity,
            id_host: elem.id_host,
            country_code: elem.country_code,
            as_name: elem.name,
            asn: elem.asn,
            created_at: elem.created_at,
          })
        )
      )
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
    this.schema.renameTable('old_reports', this.tableName)
    this.schema.alterTable(this.tableName, (table) => {
      table.index('remote_addr')
    })
  }
}
