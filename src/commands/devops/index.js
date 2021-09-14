/* eslint-disable prettier/prettier */
'use strict'
import showBanner from 'node-banner'
import inquirer from 'inquirer'
import * as logger from '../../utils/logger'
//import { dirOfChoice, fetchProjectConfig, readFileContent } from '../../utils/helpers'
//const template = require('../create/index')
//const templateServer = require('../create/backend/mongo.js')
let shell = require('shelljs')

export default async () => {
    await showBanner('VENM', 'The process to automating the project is starting ⏳', 'blue', 'white')
    const { template } = await inquirer.prompt([
        {
            name: 'template',
            type: 'list',
            message: 'Please choose wich side you want to automate 🔮',
            choices: ['client', 'server'],
        },
    ])
    if (template === 'client') {
        logger.info('Automate the client side 🔓')
        shell.cd(`./client`)
    } else if (template === 'server') {
        logger.info('Automate the server side 🔓')
        shell.cd(`./server`)
    }
}
