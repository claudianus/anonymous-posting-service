const { hooks } = use('@adonisjs/ignitor')

hooks.after.providersRegistered(() => {
  const View = use('View')
  const marked = use('marked')
  const xss = use('xss')
  const moment = use('moment')
  View.global('marked', (arg) => marked(arg, {breaks:true}))
  View.global('xss', (arg) => xss(arg))
  View.global('ago', (arg) => moment(arg).fromNow())
})
