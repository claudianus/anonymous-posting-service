'use strict'

const Model = use('Model')
const Hash = use('Hash')
const crypto = use('crypto')
const nanoid = use('nanoid')

class Comment extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (instance) => {
      instance.password = instance.password ? await Hash.make(crypto.createHash('sha256').update(instance.password).digest('hex')) : null
      instance.secureId = nanoid()
    })
  }

  post () {
    return this.belongsTo('App/Models/Post')
  }
}

module.exports = Comment
