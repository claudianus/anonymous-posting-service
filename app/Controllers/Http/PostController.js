'use strict'

const Post = use('App/Models/Post')
const Comment = use('App/Models/Comment')
const Hash = use('Hash')
const nanoid = use('nanoid')
const crypto= use('crypto')
const Env = use('Env')

class PostController {
  async list({view, request, response}) {
    const query = request.get()
    const postPagi = await Post.query().orderBy('id', 'desc').paginate(query.page, 20)
    return view.render('posts/list', {postPagi: postPagi.toJSON()})
  }

  async write({view}) {
    return view.render('posts/write')
  }

  async edit({view, params, session}) {
    const post = await Post.findBy('secureId', params.secureId)
    if(!post) {
      session.flash({ error: "The post doesn't exist" })
      return response.route('posts')
    }
    return view.render('posts/edit', {post})
  }

  async delete({view, params, session}) {
    const post = await Post.findBy('secureId', params.secureId)
    if(!post) {
      session.flash({ error: "The post doesn't exist" })
      return response.route('posts')
    }
    return view.render('posts/delete', {post})
  }

  async view({view, params, request, response, session}) {
    const post = await Post.findBy('secureId', params.secureId)
    if(!post) {
      session.flash({ error: "The post doesn't exist" })
      return response.route('posts')
    }
    post.views++
    await post.save()
    const query = request.get()
    const commentPagi = await Comment.query().where('post_id', post.id).orderBy('id', 'desc').paginate(query.page, 20)
    return view.render('posts/view', {post, commentPagi: commentPagi.toJSON()})
  }

  async store({request, response, session}) {
    const body = request.post()
    const newPost = new Post
    newPost.secureId = nanoid()
    if(body.title) newPost.title = body.title
    if(body.content) newPost.content = body.content
    newPost.password = body.password ? await Hash.make(crypto.createHash('sha256').update(body.password).digest('hex')) : null
    await newPost.save()
    session.flash({ success: "Posted!" })
    return response.route('view', { secureId: newPost.secureId })
  }

  async update({request, response, params, session}) {
    const body = request.post()
    const post = await Post.findBy('secureId', params.secureId)
    if(!post) {
      session.flash({ error: "The post doesn't exist" })
      return response.route('posts')
    }
    if(body.password !== Env.get('MASTER_PASSWORD')) {
      const isSame = await Hash.verify(crypto.createHash('sha256').update(body.password).digest('hex'), post.password)
      if(!isSame) {
        session.flash({ error: "The password doesn't match" })
        return response.route('edit', { secureId: post.secureId })
      }
    }
    if(body.title) post.title = body.title
    if(body.content) post.content = body.content
    await post.save()
    session.flash({ success: "Updated!" })
    return response.route('view', { secureId: post.secureId })
  }

  async destroy({request, response, params, session}) {
    const body = request.post()
    const post = await Post.findBy('secureId', params.secureId)
    if(!post) {
      session.flash({ error: "The post doesn't exist" })
      return response.route('posts')
    }
    if(body.password !== Env.get('MASTER_PASSWORD')) {
      const isSame = await Hash.verify(crypto.createHash('sha256').update(body.password).digest('hex'), post.password)
      if(!isSame) {
        session.flash({ error: "The password doesn't match" })
        return response.route('delete', { secureId: post.secureId })
      }
    }
    await post.delete()
    session.flash({ success: "Deleted!" })
    return response.route('posts')
  }
}

module.exports = PostController