'use strict'

const Model = use('Model')
const Hash = use('Hash')
const crypto = use('crypto')
const nanoid = use('nanoid')

class Post extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async (instance) => {
      instance.password = instance.password ? await Hash.make(crypto.createHash('sha256').update(instance.password).digest('hex')) : null
      instance.secureId = nanoid()
    })

    this.addHook('beforeDelete', async (instance) => {
      await instance.comments().delete()
    })
  }

  comments () {
    return this.hasMany('App/Models/Comment')
  }
}

module.exports = Post
