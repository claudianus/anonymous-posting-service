'use strict'

const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.string('secureId').notNullable().index()
      table.string('title').notNullable().defaultTo('Untitled')
      table.string('content').notNullable().defaultTo('No Content')
      table.string('password').nullable()
      table.integer('views').unsigned().notNullable().defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
