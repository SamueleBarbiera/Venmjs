'use strict'
import showBanner from 'node-banner'
import inquirer from 'inquirer'
import * as logger from '../../utils/logger'
const templateServerMongo = require('../create/backend/mongo.js')
const templateServerMysql = require('../create/backend/mysql.js')
let shell = require('shelljs')
/**
 * @returns {Promise<void>}
 */

export default async () => {
    await showBanner('VENM', 'The project is starting ⏳', 'blue', 'white')
    let port
    const { template } = await inquirer.prompt([
        {
            name: 'template',
            type: 'list',
            message: 'Please choose wich side you want to start 🔮',
            choices: ['client', 'server'],
        },
    ])
    if (template === 'client') {
        logger.info('Running the client side 🔓')
        port = '8080'
        shell.exec(`npm run serve -- --port ${port} --open`)
    } else if (template === 'server') {
        logger.info('Running the server side 🔓')
        if (templateServerMongo === 'GraphQL' || templateServerMysql === 'GraphQL') {
            port = '9000/graphql'
        } else {
            port = '9000/api'
        }
        shell.exec(`npm run serve -- --port ${port} --open`)
    }
}
