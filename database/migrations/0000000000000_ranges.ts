import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ranges'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('country_code', 10).notNullable()
      table.string('name', 255).notNullable()
      table.string('asn', 10).notNullable().index()
      table.bigInteger('range_start').notNullable()
      table.bigInteger('range_end').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
