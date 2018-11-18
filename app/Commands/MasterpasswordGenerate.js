'use strict'

const { Command } = require('@adonisjs/ace')
const path = require('path')

class MasterpasswordGenerate extends Command {
  static get signature () {
    return 'masterpassword:generate'
  }

  static get description () {
    return 'regenerate the masterpassword'
  }

  async getEnvContent (envPath) {
    const dotEnvContents = await this.readFile(envPath)
    return require('dotenv').parse(dotEnvContents)
  }

  async updateEnvContents (envPath, envHash) {
    const updatedContents = Object.keys(envHash).map((key) => {
      return `${key}=${envHash[key]}`
    }).join('\n')

    await this.writeFile(envPath, updatedContents)
  }

  async handle (args, options) {
    const password = require('nanoid')(50)
    const env = options.env || '.env'
    const pathToEnv = path.isAbsolute(env) ? env : path.join(process.cwd(), env)
    const envHash = await this.getEnvContent(pathToEnv)
    await this.updateEnvContents(pathToEnv, Object.assign(envHash, { MASTER_PASSWORD: password }))
    console.log(password)
  }
}

module.exports = MasterpasswordGenerate
