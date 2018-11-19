'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'PageController.index').as('home')

Route.get('/write', 'PostController.write').as('write')
Route.get('/posts', 'PostController.list').as('posts')
Route.get('/posts/:secureId', 'PostController.view').as('view')
Route.get('/posts/:secureId/edit', 'PostController.edit').as('edit')
Route.get('/posts/:secureId/delete', 'PostController.delete').as('delete')

Route.post('/post', 'PostController.store').as('post.store')
Route.put('/post/:secureId', 'PostController.update').as('post.update')
Route.delete('/post/:secureId', 'PostController.destroy').as('post.destroy')


Route.get('/posts/:postSecureId/comments/:commentSecureId/edit', 'CommentController.edit').as('comment.edit')
Route.get('/posts/:postSecureId/comments/:commentSecureId/delete', 'CommentController.delete').as('comment.delete')

Route.post('/post/:postSecureId/comment', 'CommentController.store').as('comment.store')
Route.put('/post/:postSecureId/comment/:commentSecureId', 'CommentController.update').as('comment.update')
Route.delete('/post/:postSecureId/comment/:commentSecureId', 'CommentController.destroy').as('comment.destroy')
