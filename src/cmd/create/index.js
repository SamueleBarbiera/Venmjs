'use strict'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import showBanner from 'node-banner'
import validate from 'validate-npm-package-name'
import * as logger from '../../preload/logger'
import { validateInput } from '../../preload/validate'
import { validateInputname } from '../../preload/validate'
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

    //#region CHECKING DIR
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
    //#endregion

    //#region BACKEND SERVER API DATABASE
    const { template_backend } = await inquirer.prompt([
        {
            name: 'template_backend',
            type: 'list',
            message: 'Please choose a BACKEND framework ✨',
            choices: ['express 1️⃣' /*, 'laravel 2️⃣'*/],
        },
    ])
    const { template_database } = await inquirer.prompt([
        {
            name: 'template_database',
            type: 'list',
            message: 'Please choose a database ✨',
            choices: ['Mongo 1️⃣', 'mysql 2️⃣'],
        },
    ])
    /*
    if (template_backend === 'laravel 2️⃣' && template_database === 'Mongo 1️⃣') {
    } else if (template_backend === 'laravel 2️⃣' && template_database === 'mysql 2️⃣') {
        const { templateServer } = await inquirer.prompt([
            {
                name: 'templateServer',
                type: 'list',
                message: 'Please choose a starter template for the CRUD API💾',
                choices: ['Rest API 1️⃣', 'GraphQL 2️⃣'],
            },
        ])
        if (templateServer === 'Rest API 1️⃣') {
            logger.info('Creating the Rest API 📃')
            fs.copySync(path.resolve(__dirname, '../../templates/server/RestAPI'), './RestAPI')
            const currPath = './RestAPI'
            const newPath = './server'
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
                    validate: validateInputname,
                },
            ])
            fs.writeFileSync('./server/.env', `DB_URL=${uri}/${name}`)
            shell.cd(`server`)
            shell.exec('npm install && npm i mongoose')
            module.exports.templateServer = 'RestAPI'
            showInstructions()
        } else if (templateServer === 'GraphQL 2️⃣') {
            fs.copySync(path.resolve(__dirname, '../../templates/server/GraphQL'), './GraphQL')
            const currPath = './GraphQL'
            const newPath = './server'
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
                    validate: validateInputname,
                },
            ])
            fs.writeFileSync('./server/.env', `DB_URL=${uri}/${name}`)
            shell.cd(`server`)
            shell.exec('npm install && npm i mongoose')
            module.exports.templateServer = 'GraphQL'
            showInstructions()
        }
    } else */ if (template_backend === 'express 1️⃣' && template_database === 'mysql 2️⃣') {
        const { templateServer } = await inquirer.prompt([
            {
                name: 'templateServer',
                type: 'list',
                message: 'Please choose a starter template for the CRUD API 💾',
                choices: ['Rest API 1️⃣', 'GraphQL 2️⃣'],
            },
        ])
        if (templateServer === 'Rest API 1️⃣') {
            logger.info('Creating the Rest API 📃')
            fs.copySync(path.resolve(__dirname, '../../templates/server/express-mysql/RestAPI'), './RestAPI')
            const currPath = './RestAPI'
            const newPath = './server'
            fs.rename(currPath, newPath)
            //fs.writeFileSync('./server/.env', `DB_URL=${uri}/${name}`)
            shell.cd(`server`)
            shell.exec('npm install && npm i mongoose')
            module.exports.templateServer = 'RestAPI'
            showInstructions()
        } else if (templateServer === 'GraphQL 2️⃣') {
            fs.copySync(path.resolve(__dirname, '../../templates/server/express-mysql/GraphQL'), './GraphQL')
            const currPath = './GraphQL'
            const newPath = './server'
            fs.rename(currPath, newPath)
            //fs.writeFileSync('./server/.env', `DB_URL=${uri}/${name}`)
            shell.cd(`server`)
            shell.exec('npm install && npm i mongoose')
            module.exports.templateServer = 'GraphQL'
            showInstructions()
        }
    } else if (template_backend === 'express 1️⃣' && template_database === 'Mongo 1️⃣') {
        const { templateServer } = await inquirer.prompt([
            {
                name: 'templateServer',
                type: 'list',
                message: 'Please choose a starter template for the CRUD API 💾',
                choices: ['Rest API 1️⃣', 'GraphQL 2️⃣'],
            },
        ])
        if (templateServer === 'Rest API 1️⃣') {
            logger.info('Creating the Rest API 📃')
            fs.copySync(path.resolve(__dirname, '../../templates/server/express-mongodb/RestAPI'), './RestAPI')
            const currPath = './RestAPI'
            const newPath = './server'
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
                    validate: validateInputname,
                },
            ])
            fs.writeFileSync('./server/.env', `DB_URL=${uri}/${name}`)
            shell.cd(`server`)
            shell.exec('npm install && npm i mongoose')
            module.exports.templateServer = 'RestAPI'
            showInstructions()
        } else if (templateServer === 'GraphQL 2️⃣') {
            fs.copySync(path.resolve(__dirname, '../../templates/server/express-mongodb/GraphQL'), './GraphQL')
            const currPath = './GraphQL'
            const newPath = './server'
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
                    validate: validateInputname,
                },
            ])
            fs.writeFileSync('./server/.env', `DB_URL=${uri}/${name}`)
            shell.cd(`server`)
            shell.exec('npm install && npm i mongoose')
            module.exports.templateServer = 'GraphQL'
            showInstructions()
        }
    }
    //#endregion

    //#region FRONTEND CLIENT
    const { template_FRONTEND } = await inquirer.prompt([
        {
            name: 'template_FRONTEND',
            type: 'list',
            message: 'Please choose a FRONTEND template ✨',
            choices: ['SSG/Jamstack 1️⃣', 'SSR 2️⃣', 'Vue 3️⃣', 'Mobile 4️⃣'],
        },
    ])
    if (template_FRONTEND === 'SSG/Jamstack 1️⃣') {
        const { template_SSG_Jam } = await inquirer.prompt([
            {
                name: 'template_SSG_Jam',
                type: 'list',
                message: 'Please choose a SSG framework ✨',
                choices: ['Vuepress 1️⃣', 'Gridsome 2️⃣'],
            },
        ])
        if (template_SSG_Jam === 'Vuepress 1️⃣') {
            logger.info('Creating the Vuepress project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "npx create-vuepress-site client && cd client && npm add --dev vitepress && npm i && npm i mongoose && exit";')
            module.exports.template = 'Vuepress'
        }
        if (template_SSG_Jam === 'Gridsome 2️⃣') {
            logger.info('Creating the Gridsome project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "gridsome create client && cd client && npm i && npm i mongoose && exit";')
            module.exports.template = 'Gridsome'
        }
    } else if (template_FRONTEND === 'SSR 2️⃣') {
        const { template_SSR } = await inquirer.prompt([
            {
                name: 'template_SSR',
                type: 'list',
                message: 'Please choose a SSR framework ✨',
                choices: ['Nuxt 1️⃣', 'Quasar 2️⃣'],
            },
        ])
        if (template_SSR === 'Nuxt 1️⃣') {
            logger.info('Creating the Nuxt-Vite project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "npm init nuxt-app@latest client && cd client && npm i -D nuxt-vite && npm i mongoose && exit";')
            logger.info(`Insert in nuxt.config 👉 buildModules: ['nuxt-vite']`)
            /*IMPLEMENTATION OF VITE
            const template = path.resolve(__dirname, '../../templates/create/nuxt')
            if (templateDir != 'client' || templateDir != 'server') {
                shell.cd('cd client')
                fs.unlink(`nuxt.config.js`)
                fs.copySync((`${appName}/client`, `${template}`), 'nuxt.config.js')
            } else if (templateDir != 'client' || templateDir === 'server') {
                shell.exec('cd .. && cd client')
                fs.unlink(`nuxt.config.js`)
                fs.copySync((`${appName}/client`, `${template}`), 'nuxt.config.js')
            }
            */
            module.exports.template = 'Nuxt'
        }
        if (template_SSR === 'Quasar 2️⃣') {
            logger.info('Creating the Quasar project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "quasar create client && cd client && npm i && npm i mongoose && exit";')
            module.exports.template = 'Quasar'
        }
    } else if (template_FRONTEND === 'Vue 3️⃣') {
        logger.info('Creating the Vue-Vite project 📃')
        shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "vue create client && cd client && npm install && npm i @vitejs/plugin-vue && vue add vite && npm i mongoose && exit";')
        module.exports.template = 'Vue'
    } else if (template_FRONTEND === 'Mobile 4️⃣') {
        const { template_Mobile } = await inquirer.prompt([
            {
                name: 'template_Mobile',
                type: 'list',
                message: 'Please choose a MOBILE framework ✨',
                choices: ['Vue native 1️⃣', 'Ionic 2️⃣'],
            },
        ])
        if (template_Mobile === 'Vue native 1️⃣') {
            logger.info('Creating the VueNative project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "vue-native init client && npm install && npm i mongoose && exit";')
            module.exports.template = 'Vue native'
        }
        if (template_Mobile === 'Ionic 2️⃣') {
            logger.info('Creating the VueNative project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "ionic start client tabs --type vue --capacitor && npm install && npm i mongoose && exit";')
            module.exports.template = 'Ionic'
        }
    }
    //#endregion
}
