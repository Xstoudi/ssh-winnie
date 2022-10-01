import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('username', 32).notNullable()
      table.string('password', 255).notNullable()
      table.string('remote_addr', 45).notNullable().index()
      table.string('remote_identity', 255).notNullable()
      table.integer('id_host').unsigned().references('id').inTable('hosts').notNullable()
      table.string('country_code', 2).nullable()
      table.string('as_name', 255).nullable()
      table.integer('asn', 10).nullable()
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
