'use strict'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import showBanner from 'node-banner'
import validate from 'validate-npm-package-name'
import * as logger from '../../preload/logger'
import { validateInput } from '../../preload/validate'
let projectPathRelative
let shell = require('shelljs')
/**
 * @returns {Void}
 * @returns {Promise<void>}
 * @param {String} appName
 * @returns {Promise<void>}
 * @param {String} template
 * @returns {Promise<void>}
 * @param {String} templateServer
 * @returns {Promise<void>}
 */

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

export default async (appName) => {
    await showBanner('VENM', '-------------------------------------------------------------------------------', 'blue', 'white')
    let isCurrentDir = false

    if (appName === '.') {
        isCurrentDir = true
        appName = path.basename(process.cwd())
    } else if (process.argv[4] && !process.argv[4].startsWith('-')) {
        logger.error('\n Error: Kindly provide only one argument as the directory name❗❗')
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
    projectPathRelative = isCurrentDir ? '.' : appName
    shell.cd(`./${appName}`)

    //#region CLIENT
    const { template } = await inquirer.prompt([
        {
            name: 'template',
            type: 'list',
            message: 'Please choose a starter template for the client side 🔮',
            choices: ['Vue 1️⃣', 'Nuxt 2️⃣', 'Mobile 3️⃣'],
        },
    ])

    if (template === 'Vue 1️⃣') {
        logger.info('Creating the Vue-Vite project 📃')
        shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "vue create client && cd client && npm install && npm i @vitejs/plugin-vue && vue add vite && npm i mongoose && exit";')
        module.exports.template = 'Vue'
    } else if (template === 'Nuxt 2️⃣') {
        logger.info('Creating the Nuxt-Vite project 📃')
        shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "npm init nuxt-app@latest client && cd client && npm i -D nuxt-vite && npm i mongoose && exit";')
        fs.unlink(`./${appName}/client/nuxt.config.js`)
        fs.copySync(path.resolve(__dirname, '../../templates/create/nuxt/nuxt.config.js'), 'nuxt.config.js')
        module.exports.template = 'Nuxt'
    } else if (template === 'Mobile 3️⃣') {
        logger.info('Creating the VueNative project 📃')
        shell.exec('vue-native init client && npm install && npm i mongoose')
        module.exports.template = 'Mobile'
    }
    //#endregion

    //#region SERVER
    const { templateServer } = await inquirer.prompt([
        {
            name: 'templateServer',
            type: 'list',
            message: 'Please choose a starter template for the server side 💾',
            choices: ['Rest API 1️⃣', 'GraphQL 2️⃣'],
        },
    ])
    if (templateServer === 'Rest API 1️⃣') {
        /*logger.info('Creating the Rest API 📃')
        const srcDir = `templates/server/RestAPI/*`
        const destDir = `./${appName}`
        const currPath = './RestAPI'
        const newPath = './server'
        fs.copy(srcDir, destDir)
        fs.rename(currPath, newPath)
        const { uri } = await inquirer.prompt([
            {
                type: 'input',
                name: 'uri',
                message: 'Enter the URI of you MongoDB 👇',
                default: 'mongodb://localhost:27017',
                validate: validateInput,
            },
        ])
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of your new Database 👇',
                default: 'example',
                validate: validateInput,
            },
        ])
        fs.writeFileSync(path.join('server', '.env'), `DB_URL=${uri}/${name}`)
        shell.cd(`/server`)
        shell.exec('npm install && npm i mongoose')
        module.exports.templateServer = 'RestAPI'
        showInstructions()*/
        logger.info('Creating the Rest API 📃')
        shell.exec('git clone https://github.com/SamueleBarbiera/server_restapi_crud.git')
        const currPath = './server_restapi_crud'
        const newPath = './server'
        fs.rename(currPath, newPath, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('Successfully renamed the directory.')
            }
        })
        shell.exec('npm install && npm i mongoose')
        module.exports.templateServer = 'RestAPI'
        showInstructions()
    } else if (templateServer === 'GraphQL 2️⃣') {
        logger.info('Creating the GraphQL project 📃')
        const srcDir = `../../templates/server/GraphQL`
        const destDir = `./${appName}`
        const currPath = './GraphQL'
        const newPath = './server'
        fs.copySync(srcDir, destDir)
        fs.rename(currPath, newPath)
        const { uri } = await inquirer.prompt([
            {
                type: 'input',
                name: 'uri',
                message: 'Enter the URI of you MongoDB 👇',
                default: 'mongodb://localhost:27017',
                validate: validateInput,
            },
        ])
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'uri',
                message: 'Enter the name of your new DB 👇',
                default: 'example',
                validate: validateInput,
            },
        ])
        fs.writeFileSync(path.join('server', '.env'), `DB_URL=${uri}/${name}`)
        shell.cd(`/server`)
        shell.exec('npm install && npm i mongoose')
        module.exports.templateServer = 'GraphQL'
        showInstructions()
    }
    //#endregion
}
