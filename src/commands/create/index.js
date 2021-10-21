/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
'use strict'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import showBanner from 'node-banner'
import validate from 'validate-npm-package-name'
import exec from '../../utils/exec'
import * as logger from '../../utils/logger'
import { frontend } from './frontend/frontend.js'
import { backend } from './backend/backend.js'
import { validateInstallation } from '../../utils/validate'
let shell = require('shelljs')
let projectPathRelative
/**
 * @returns {Void}
 * @returns {Promise<void>}
 * @param {String} appName
 * @returns {Promise<void>}
 * @param {String} template
 * @returns {Promise<void>}
 * @param {String} templateServer
 * @returns {Promise<void>}
 * @param {String} template_FRONTEND
 * @returns {Promise<void>}
 * @param {String} template_SSG_Jam
 * @returns {Promise<void>}
 * @param {String} template_SSR
 * @returns {Promise<void>}
 * @param {String} template_VUE
 * @returns {Promise<void>}
 * @param {String} template_Mobile
 * @returns {Promise<void>}
 * @param {String} template_backend
 * @returns {Promise<void>}
 * @param {String} template_database
 * @returns {Promise<void>}
 */

export default async (appName) => {
    await showBanner('VENM', '-------------------------------------------------------------------------------', 'blue', 'white')
    let isCurrentDir = false
    //#region CHECKING DIR
    if (appName === '.') {
        isCurrentDir = true
        appName = path.basename(process.cwd())
    } else if (process.argv[4] && !process.argv[4].startsWith('-')) {
        logger.error('\n Error: Provide only one argument as the directory name❗')
        process.exit(1)
    } else if (!validate(appName)) {
        logger.error(` Error: Could not create a project called "${chalk.cyan.bold(appName)}" because of npm naming restrictions:`)
        process.exit(1)
    } else if (isCurrentDir) {
        if (fs.readdirSync('.').length) {
            logger.error(`\n It seems the current directory isn't empty.\n`)
            process.exit(1)
        }
    } else if (!isCurrentDir && fs.existsSync(appName)) {
        logger.error(`\n Error: Directory ${chalk.cyan.bold(appName)} already exists in path❗`)
        process.exit(1)
    } else if (!isCurrentDir) {
        fs.mkdirSync(appName)
    }
    module.exports.appName = `./${appName}`
    shell.cd(`./${appName}`)
    const showInstructions = () => {
        const isCurrentDir = projectPathRelative === '.'
        let userCommandInstruction = chalk.green.bold('venm start')

        if (!isCurrentDir) {
            userCommandInstruction = `${chalk.green.bold(`cd ${appName}`)} && ${userCommandInstruction}`
        }

        logger.info(`Everything ready 👌 `)
        logger.info(`Now type in ${userCommandInstruction}`)
    }
    //#endregion
    await validateInstallation('yarn')
    await validateInstallation('git')
    //await backend()

    await frontend()
    await showInstructions()
    module.exports = appName
}
