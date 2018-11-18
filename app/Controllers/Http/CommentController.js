'use strict'

const Comment = use('App/Models/Comment')
const Post = use('App/Models/Post')
const Hash = use('Hash')
const crypto = use('crypto')
const Env = use('Env')

class CommentController {
  async edit({view, params, session, response}) {
    const comment = await Comment.find(params.commentId)
    if(!comment) {
      session.flash({error:"The comment doesn't exist"})
      return response.route('view', {secureId: params.postSecureId})
    }
    const post = await Post.find(comment.post_id)
    return view.render('comments.edit', {post, comment})
  }

  async delete({view, params, session, response}) {
    const comment = await Comment.find(params.commentId)
    if(!comment) {
      session.flash({error:"The comment doesn't exist"})
      return response.route('view', {secureId: params.postSecureId})
    }
    const post = await Post.find(comment.post_id)
    return view.render('comments.delete', {post, comment})
  }

  async store({request, response, params, session}) {
    const body = request.post()
    const post = await Post.findBy('secureId', params.postSecureId)
    if(!post) {
      session.flash({error:"The post doesn't exist"})
      return response.route('posts')
    }
    const newComment = new Comment
    newComment.post_id = post.id
    if(body.content) newComment.content = body.content
    newComment.password = body.password ? await Hash.make(crypto.createHash('sha256').update(body.password).digest('hex')) : null
    await newComment.save()
    session.flash({comment_success:"Posted!"})
    return response.route('view', {secureId: params.postSecureId})
  }

  async update({request, response, params, session}) {
    const body = request.post()
    const comment = await Comment.find(params.commentId)
    if(!comment) {
      session.flash({comment_error:"The comment doesn't exist"})
      return response.route('view', {secureId: params.postSecureId})
    }
    if(body.password !== Env.get('MASTER_PASSWORD')) {
      const isSame = await Hash.verify(crypto.createHash('sha256').update(body.password).digest('hex'), comment.password)
      if(!isSame) {
        session.flash({ error: "The password doesn't match" })
        return response.route('comment.edit', { postSecureId: params.postSecureId, commentId: comment.id })
      }
    }
    comment.content = body.content
    await comment.save()
    session.flash({comment_success:"Updated!"})
    return response.route('view', {secureId: params.postSecureId})
  }

  async destroy({request, response, params, session}) {
    const body = request.post()
    const comment = await Comment.find(params.commentId)
    if(!comment) {
      session.flash({comment_error:"The comment doesn't exist"})
      return response.route('view', {secureId: params.postSecureId})
    }
    if(body.password !== Env.get('MASTER_PASSWORD')) {
      const isSame = await Hash.verify(crypto.createHash('sha256').update(body.password).digest('hex'), comment.password)
      if(!isSame) {
        session.flash({error: "The password doesn't match" })
        return response.route('comment.delete', { postSecureId: params.postSecureId, commentId: comment.id })
      }
    }
    await comment.delete()
    session.flash({comment_success:"Deleted!"})
    return response.route('view', {secureId: params.postSecureId})
  }

}

module.exports = CommentController
