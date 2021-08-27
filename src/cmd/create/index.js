/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
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
import { validateInputhost } from '../../preload/validate'
import { validateInputuser } from '../../preload/validate'
import { validateInputpass } from '../../preload/validate'
import { validateInputdb } from '../../preload/validate'
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

    //#region FRONTEND CLIENT
    const { template_FRONTEND } = await inquirer.prompt([
        {
            name: 'template_FRONTEND',
            type: 'list',
            message: 'Please choose a FRONTEND template ✨',
            choices: ['SSG/Jamstack 1️⃣', 'SSR 2️⃣', 'Vue 3️⃣', 'Mobile 4️⃣', 'Multi Platform 5️⃣'],
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
        showInstructions()
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
    } else if (template_FRONTEND === 'Multi Platform 5️⃣') {
        logger.info('Creating the Electron project 📃')
        shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "vue create client && cd client && vue add electron-builder && npm install && npm i mongoose && exit";')
        module.exports.template = 'Multi Platform'
    }
    //#endregion

    //#region BACKEND SERVER API DATABASE
    const { template_backend } = await inquirer.prompt([
        {
            name: 'template_backend',
            type: 'list',
            message: 'Please choose a BACKEND framework ✨',
            choices: ['express 1️⃣', 'laravel 2️⃣'],
        },
    ])
    const { template_database } = await inquirer.prompt([
        {
            name: 'template_database',
            type: 'list',
            message: 'Please choose a DATABASE ✨',
            choices: ['Mongo 1️⃣', 'mysql 2️⃣'],
        },
    ])
    //#region MONGODB
    if (template_backend === 'laravel 2️⃣' && template_database === 'Mongo 1️⃣') {
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
            fs.copySync(path.resolve(__dirname, '../../templates/server/laravel-mongodb/RestAPI'), './RestAPI')
            const currPath = './RestAPI'
            const newPath = './server'
            fs.rename(currPath, newPath)
            const { host } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the HOST of the Mongodb 👇',
                    default: '127.0.0.1',
                    validate: validateInputhost,
                },
            ])
            const { user } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the USER of the Mongodb 👇',
                    default: 'root',
                    validate: validateInputuser,
                },
            ])
            const { pass } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the PASSWORD of the Mongodb 👇',
                    default: '',
                    validate: validateInputpass,
                },
            ])
            const { db } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the new Database 👇',
                    default: 'example',
                    validate: validateInputdb,
                },
            ])
            fs.writeFileSync(
                './server/.env',
                `APP_NAME=Laravel
                APP_ENV=local
                APP_KEY=base64:Q2JklRcMGT2RfbDcJprAZs4q8stBo0A79ltNzm6scAM=
                APP_DEBUG=true
                APP_URL=http://localhost

                LOG_CHANNEL=stack
                LOG_LEVEL=debug

                MONGO_DB_HOST=${host}
                MONGO_DB_PORT=${port}
                MONGO_DB_DATABASE=${db}
                MONGO_DB_USERNAME=${user}
                MONGO_DB_PASSWORD=${pass}

                BROADCAST_DRIVER=log
                CACHE_DRIVER=file
                FILESYSTEM_DRIVER=local
                QUEUE_CONNECTION=sync
                SESSION_DRIVER=file
                SESSION_LIFETIME=120

                MEMCACHED_HOST=127.0.0.1

                REDIS_HOST=127.0.0.1
                REDIS_PASSWORD=null
                REDIS_PORT=6379

                MAIL_MAILER=smtp
                MAIL_HOST=mailhog
                MAIL_PORT=1025
                MAIL_USERNAME=null
                MAIL_PASSWORD=null
                MAIL_ENCRYPTION=null
                MAIL_FROM_ADDRESS=null
                MAIL_FROM_NAME="${APP_NAME}"

                AWS_ACCESS_KEY_ID=
                AWS_SECRET_ACCESS_KEY=
                AWS_DEFAULT_REGION=us-east-1
                AWS_BUCKET=
                AWS_USE_PATH_STYLE_ENDPOINT=false

                PUSHER_APP_ID=
                PUSHER_APP_KEY=
                PUSHER_APP_SECRET=
                PUSHER_APP_CLUSTER=mt1

                MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
                MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"`
            )
            fs.writeFileSync(
                './app/Models/Users.php',
                `<?php

               namespace App\Models;
               
               use Illuminate\Database\Eloquent\Model;
               use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
               
               class Users extends Eloquent
               {
                   protected $connection = 'prova';
                   protected $collection = 'users';
               
                   protected $fillable = [
                       'name', 'age', 'description'
                   ];
               }`
            )
            shell.cd(`server`)
            shell.exec('composer install && php artisan key:generate && php artisan migrate && php artisan db:seed &&  php artisan passport:install && npm install && npm i mongoose')
            module.exports.templateServer = 'RestAPI'
            showInstructions()
        } else if (templateServer === 'GraphQL 2️⃣') {
            fs.copySync(path.resolve(__dirname, '../../templates/server/laravel-mongodb/GraphQL'), './GraphQL')
            const currPath = './GraphQL'
            const newPath = './server'
            fs.rename(currPath, newPath)
            const { host } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the HOST of the Mongodb 👇',
                    default: 'localhost',
                    validate: validateInputhost,
                },
            ])
            const { user } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the USER of the Mongodb 👇',
                    default: 'root',
                    validate: validateInputuser,
                },
            ])
            const { pass } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the PASSWORD of the Mongodb 👇',
                    default: '',
                    validate: validateInputpass,
                },
            ])
            const { db } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the new Database 👇',
                    default: 'example',
                    validate: validateInputdb,
                },
            ])
            fs.writeFileSync(
                './server/models/index.js',
                `import Sequelize from 'sequelize'

                const sequelize = new Sequelize('${db}', '${user}', '${pass}', {
                    host: '${host}',
                    dialect: 'mysql',
                    operatorsAliases: false,
                })
                
                const db = {
                    User: sequelize.import('./user.js'),
                }
                
                db.sequelize = sequelize
                db.Sequelize = Sequelize
                
                export default db`
            )
            shell.cd(`server`)
            shell.exec('composer install && php artisan key:generate && php artisan migrate && php artisan db:seed &&  php artisan passport:install && npm install && npm i mongoose')
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
                    message: 'Enter the URI of the MongoDB 👇',
                    default: 'mongodb://localhost:27017',
                    validate: validateInput,
                },
            ])
            const { name } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the new Database 👇',
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
                    message: 'Enter the URI of the MongoDB 👇',
                    default: 'mongodb://localhost:27017',
                    validate: validateInput,
                },
            ])
            const { name } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the new Database 👇',
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

    //#region MYSQL
    else if (template_backend === 'laravel 2️⃣' && template_database === 'mysql 2️⃣') {
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
            fs.copySync(path.resolve(__dirname, '../../templates/server/laravel-mysql/RestAPI'), './RestAPI')
            const currPath = './RestAPI'
            const newPath = './server'
            fs.rename(currPath, newPath)
            const { host } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the HOST of the Mongodb 👇',
                    default: '127.0.0.1',
                    validate: validateInputhost,
                },
            ])
            const { user } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the USER of the Mongodb 👇',
                    default: 'root',
                    validate: validateInputuser,
                },
            ])
            const { pass } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the PASSWORD of the Mongodb 👇',
                    default: '',
                    validate: validateInputpass,
                },
            ])
            const { db } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the new Database 👇',
                    default: 'example',
                    validate: validateInputdb,
                },
            ])
            fs.writeFileSync(
                './server/.env',
                `APP_NAME=Laravel
                APP_ENV=local
                APP_KEY=base64:Q2JklRcMGT2RfbDcJprAZs4q8stBo0A79ltNzm6scAM=
                APP_DEBUG=true
                APP_URL=http://localhost

                LOG_CHANNEL=stack
                LOG_LEVEL=debug

                DB_CONNECTION=mysql
                DB_HOST=${host}
                DB_PORT=${port}
                DB_DATABASE=${db}
                DB_USERNAME=${user}
                DB_PASSWORD=${pass}

                BROADCAST_DRIVER=log
                CACHE_DRIVER=file
                FILESYSTEM_DRIVER=local
                QUEUE_CONNECTION=sync
                SESSION_DRIVER=file
                SESSION_LIFETIME=120

                MEMCACHED_HOST=127.0.0.1

                REDIS_HOST=127.0.0.1
                REDIS_PASSWORD=null
                REDIS_PORT=6379

                MAIL_MAILER=smtp
                MAIL_HOST=mailhog
                MAIL_PORT=1025
                MAIL_USERNAME=null
                MAIL_PASSWORD=null
                MAIL_ENCRYPTION=null
                MAIL_FROM_ADDRESS=null
                MAIL_FROM_NAME="${APP_NAME}"

                AWS_ACCESS_KEY_ID=
                AWS_SECRET_ACCESS_KEY=
                AWS_DEFAULT_REGION=us-east-1
                AWS_BUCKET=
                AWS_USE_PATH_STYLE_ENDPOINT=false

                PUSHER_APP_ID=
                PUSHER_APP_KEY=
                PUSHER_APP_SECRET=
                PUSHER_APP_CLUSTER=mt1

                MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
                MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"`
            )
            shell.cd(`server`)
            shell.exec('composer install && php artisan key:generate && php artisan migrate && php artisan db:seed &&  php artisan passport:install && npm install && npm i mongoose')
            module.exports.templateServer = 'RestAPI'
            showInstructions()
        } else if (templateServer === 'GraphQL 2️⃣') {
            fs.copySync(path.resolve(__dirname, '../../templates/server/laravel-mysql/GraphQL'), './GraphQL')
            const currPath = './GraphQL'
            const newPath = './server'
            fs.rename(currPath, newPath)
            const { host } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the HOST of the mySQL db 👇',
                    default: 'localhost',
                    validate: validateInputhost,
                },
            ])
            const { user } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the USER of the mySQL db 👇',
                    default: 'root',
                    validate: validateInputuser,
                },
            ])
            const { pass } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the PASSWORD of the mySQL db 👇',
                    default: '',
                    validate: validateInputpass,
                },
            ])
            const { db } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the new Database 👇',
                    default: 'example',
                    validate: validateInputdb,
                },
            ])
            fs.writeFileSync(
                './server/models/index.js',
                `import Sequelize from 'sequelize'

                const sequelize = new Sequelize('${db}', '${user}', '${pass}', {
                    host: '${host}',
                    dialect: 'mysql',
                    operatorsAliases: false,
                })
                
                const db = {
                    User: sequelize.import('./user.js'),
                }
                
                db.sequelize = sequelize
                db.Sequelize = Sequelize
                
                export default db`
            )
            shell.cd(`server`)
            shell.exec('composer install && php artisan key:generate && php artisan migrate && php artisan db:seed &&  php artisan passport:install && npm install')
            module.exports.templateServer = 'GraphQL'
            showInstructions()
        }
    } else if (template_backend === 'express 1️⃣' && template_database === 'mysql 2️⃣') {
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
            const { host } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the HOST of the mySQL db 👇',
                    default: 'localhost',
                    validate: validateInputhost,
                },
            ])
            const { user } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the USER of the mySQL db 👇',
                    default: 'root',
                    validate: validateInputuser,
                },
            ])
            const { pass } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the PASSWORD of the mySQL db 👇',
                    default: '',
                    validate: validateInputpass,
                },
            ])
            const { db } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the new Database 👇',
                    default: 'example',
                    validate: validateInputdb,
                },
            ])
            fs.writeFileSync(
                './server/config/db.config.js',
                `con.connect(function (err) {
                if (err) throw err
                console.log('Connected!')
                con.query('CREATE DATABASE ${db}', function (err, result) {
                    if (err) throw err
                    console.log('Database created')
                })
              })
              
              module.exports = {
                  HOST: '${host}',
                  USER: '${user}',
                  PASSWORD: '${pass}',
                  DB: '${db}',
              }`
            )
            shell.cd(`server`)
            shell.exec('npm install && npm i mongoose')
            module.exports.templateServer = 'RestAPI'
            showInstructions()
        } else if (templateServer === 'GraphQL 2️⃣') {
            fs.copySync(path.resolve(__dirname, '../../templates/server/express-mysql/GraphQL'), './GraphQL')
            const currPath = './GraphQL'
            const newPath = './server'
            fs.rename(currPath, newPath)
            const { host } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the HOST of the mySQL db 👇',
                    default: 'localhost',
                    validate: validateInputhost,
                },
            ])
            const { user } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the USER of the mySQL db 👇',
                    default: 'root',
                    validate: validateInputuser,
                },
            ])
            const { pass } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'uri',
                    message: 'Enter the PASSWORD of the mySQL db 👇',
                    default: '',
                    validate: validateInputpass,
                },
            ])
            const { db } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter the name of the new Database 👇',
                    default: 'example',
                    validate: validateInputdb,
                },
            ])
            fs.writeFileSync(
                './server/models/index.js',
                `import Sequelize from 'sequelize'

                const sequelize = new Sequelize('${db}', '${user}', '${pass}', {
                    host: '${host}',
                    dialect: 'mysql',
                    operatorsAliases: false,
                })
                
                const db = {
                    User: sequelize.import('./user.js'),
                }
                
                db.sequelize = sequelize
                db.Sequelize = Sequelize
                
                export default db`
            )
            shell.cd(`server`)
            shell.exec('npm install && npm i mongoose')
            module.exports.templateServer = 'GraphQL'
            showInstructions()
        }

        //#endregion
    }
    //#endregion
}
