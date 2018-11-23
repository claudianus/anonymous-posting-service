'use strict'

const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.string('secureId').notNullable().index().unique()
      table.integer('post_id').unsigned().notNullable().references('id').inTable('posts').index()
      table.string('content').notNullable().defaultTo('No Content')
      table.string('password').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
