import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('username', 32).notNullable()
      table.string('password', 255).notNullable()
      table.string('remote_addr', 15).notNullable().index()
      table.string('remote_identity', 255).notNullable()
      table.integer('id_range').unsigned().references('id').inTable('ranges').notNullable()
      table.integer('id_host').unsigned().references('id').inTable('hosts').notNullable()
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
