/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
'use strict'
import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import * as logger from '../../../utils/logger'
import { validateInputhost } from '../../../utils/validate'
import { validateInputuser } from '../../../utils/validate'
import { validateInputpass } from '../../../utils/validate'
import { validateInputdb } from '../../../utils/validate'
import exec from '../../../utils/exec'
let shell = require('shelljs')

export async function mysql() {
    const { template_backend } = await inquirer.prompt([
        {
            name: 'template_backend',
            type: 'list',
            message: 'Please choose a BACKEND framework ✨',
            choices: ['express', 'laravel'],
        },
    ])
    //#region MYSQL
    if (template_backend === 'laravel') {
        const { templateServer } = await inquirer.prompt([
            {
                name: 'templateServer',
                type: 'list',
                message: 'Please choose a starter template for the CRUD API💾',
                choices: ['Rest API', 'GraphQL'],
            },
        ])
        if (templateServer === 'Rest API') {
            logger.info('Creating the Rest API 📃')
            fs.copySync(path.resolve(__dirname, '../../../templates/server/laravel-mysql/RestAPI'), './RestAPI')
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
                    default: 'root',
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
            await exec('composer install', 'Composer installed')
            await exec('php artisan key:generate', 'Artisan key generated')
            await exec('php artisan migrate', 'Artisan migrated')
            await exec('php artisan db:seed', 'Artisan db seed done')
            await exec('php artisan passport:install', 'Passport Installed')
            await exec('npm install', 'Installing Dependencies')
            module.exports.templateServer = 'RestAPI'
        } else if (templateServer === 'GraphQL') {
            fs.copySync(path.resolve(__dirname, '../../../templates/server/laravel-mysql/GraphQL'), './GraphQL')
            const currPath = './GraphQL'
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
            await exec('composer install', 'Composer installed')
            await exec('php artisan key:generate', 'Artisan key generated')
            await exec('php artisan migrate', 'Artisan migrated')
            await exec('php artisan db:seed', 'Artisan db seed done')
            await exec('php artisan passport:install', 'Passport Installed')
            await exec('npm install', 'Installing Dependencies')
            module.exports.templateServer = 'GraphQL'
        }
    } else if (template_backend === 'express') {
        const { templateServer } = await inquirer.prompt([
            {
                name: 'templateServer',
                type: 'list',
                message: 'Please choose a starter template for the CRUD API 💾',
                choices: ['Rest API', 'GraphQL'],
            },
        ])
        if (templateServer === 'Rest API') {
            logger.info('Creating the Rest API 📃')
            fs.copySync(path.resolve(__dirname, '../../../templates/server/express-mysql/RestAPI'), './RestAPI')
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
            await exec('npm install','Installing Dependencies')
            module.exports.templateServer = 'RestAPI'
        } else if (templateServer === 'GraphQL') {
            fs.copySync(path.resolve(__dirname, '../../../templates/server/express-mysql/GraphQL'), './GraphQL')
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
                    default: 'root',
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
            await exec('npm install','Installing Dependencies')
            module.exports.templateServer = 'GraphQL'
        }
        //#endregion
    }
}
