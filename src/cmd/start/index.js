'use strict'
import showBanner from 'node-banner'
import inquirer from 'inquirer'
import * as logger from '../../preload/logger'
const projectTemplate = require('../create/index')
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
    const { run } = await inquirer.prompt([
        {
            name: 'template',
            type: 'list',
            message: 'Choose the running method (check the package.json) ❗⏳',
            choices: ['dev', 'serve', 'build'],
        },
    ])
    if (template === 'client') {
        logger.info('Running the client side 🔓')
        shell.cd(`./client`)
        port = '8080'
        if (run === 'dev') {
            shell.exec(`npm run dev -- --port ${port} --open`)
        } else if (run === 'serve') {
            shell.exec(`npm run serve -- --port ${port} --open`)
        } else if (run === 'build') {
            shell.exec(`npm run build`)
        }
    } else if (template === 'server') {
        logger.info('Running the server side 🔓')
        shell.cd(`./server`)
        if (projectTemplate === 'GraphQL') {
            port = '9000/graphql'
        } else {
            port = '9000/api'
        }
        if (run === 'dev') {
            shell.exec(`npm run dev -- --port ${port} --open`)
        } else if (run === 'serve') {
            shell.exec(`npm run serve -- --port ${port} --open`)
        } else if (run === 'build') {
            shell.exec(`npm run build`)
        }
    }
}
