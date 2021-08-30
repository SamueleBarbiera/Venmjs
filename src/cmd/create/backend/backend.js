/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
'use strict'
import * as logger from '../../../preload/logger'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { mongo } from './mongo.js'
import { mysql } from './mysql.js'
let projectPathRelative

export async function backend() {
    //ISTRUZIONI INIZIALI
    const showInstructions = () => {
        const isCurrentDir = projectPathRelative === '.'
        let userCommandInstruction = chalk.green.bold('venm start')

        if (!isCurrentDir) {
            userCommandInstruction = `${chalk.green.bold(`cd ${projectPathRelative}`)} && ${userCommandInstruction}`
        }

        logger.info(`Everything ready 👌 `)
        logger.info(`Now type in ${userCommandInstruction}`)
    }
    //#region BACKEND SERVER API DATABASE
    const { template_database } = await inquirer.prompt([
        {
            name: 'template_database',
            type: 'list',
            message: 'Please choose a DATABASE ✨',
            choices: ['Mongo 1️⃣', 'mysql 2️⃣'],
        },
    ])
    if (template_database === 'Mongo 1️⃣') {
        await mongo(showInstructions)
    } else {
        await mysql(showInstructions)
    }
    //#endregion
}
