/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
'use strict'
import fs from 'fs-extra'
import path from 'path'
import inquirer from 'inquirer'
import * as logger from '../../../utils/logger'
import { validateInput } from '../../../utils/validate'
import { validateInputname } from '../../../utils/validate'
import { validateInputhost } from '../../../utils/validate'
import { validateInputuser } from '../../../utils/validate'
import { validateInputpass } from '../../../utils/validate'
import { validateInputdb } from '../../../utils/validate'
let shell = require('shelljs')

export async function mongo() {
    const { template_backend } = await inquirer.prompt([
        {
            name: 'template_backend',
            type: 'list',
            message: 'Please choose a BACKEND framework ✨',
            choices: ['express 1️⃣', 'laravel 2️⃣'],
        },
    ])
    //#region MONGODB
    if (template_backend === 'laravel 2️⃣') {
        logger.info('Creating the Rest API 📃')
        fs.copySync(path.resolve(__dirname, '../../../templates/server/laravel-mongodb/RestAPI'), './RestAPI')
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
            './app/Users.php',
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
        let templateServer
        module.exports.templateServer = 'RestAPI'
    } else if (template_backend === 'express 1️⃣') {
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
            fs.copySync(path.resolve(__dirname, '../../../templates/server/express-mongodb/RestAPI'), './RestAPI')
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
        } else if (templateServer === 'GraphQL 2️⃣') {
            fs.copySync(path.resolve(__dirname, '../../../templates/server/express-mongodb/GraphQL'), './GraphQL')
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
        }
    }
    //#endregion
}
