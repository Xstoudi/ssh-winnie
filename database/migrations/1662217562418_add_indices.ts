import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.alterTable('reports', (table) => {
      table.index('username')
      table.index('password')
      table.index('remote_identity')
      table.index('country_code')
      table.index('as_name')
      table.index('asn')
    })
  }

  public async down() {
    this.schema.alterTable('reports', (table) => {
      table.dropIndex('username')
      table.dropIndex('password')
      table.dropIndex('remote_identity')
      table.dropIndex('country_code')
      table.dropIndex('as_name')
      table.dropIndex('asn')
    })
  }
}
