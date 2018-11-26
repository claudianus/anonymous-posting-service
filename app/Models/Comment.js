'use strict'

const Model = use('Model')
const Hash = use('Hash')
const crypto = use('crypto')
const generate = use('nanoid/generate')

class Comment extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (instance) => {
      instance.password = instance.password ? await Hash.make(crypto.createHash('sha256').update(instance.password).digest('hex')) : null
      instance.secureId = generate('0123456789abcdefghijklmnopqrstuvwxyz', 32)
    })
  }

  post () {
    return this.belongsTo('App/Models/Post')
  }
}

module.exports = Comment
