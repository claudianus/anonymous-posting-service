'use strict'

class PageController {
  async index({view}) {
    return view.render('home')
  }
}

module.exports = PageController
