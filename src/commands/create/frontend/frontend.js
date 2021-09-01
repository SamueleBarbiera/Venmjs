/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
'use strict'
import inquirer from 'inquirer'
import * as logger from '../../../utils/logger'
import validate from 'validate-npm-package-name'
let shell = require('shelljs')

export async function frontend() {
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
            await validate('vuepress')
            logger.info('Creating the Vuepress project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && npx create-vuepress-site client && cd client && npm add --dev vitepress && npm i && npm i mongoose && exit";')
            module.exports.template = 'Vuepress'
        }
        if (template_SSG_Jam === 'Gridsome 2️⃣') {
            await validate('@gridsome/cli')
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
            await validate('nuxt')
            await validate('create-nuxt-app')
            logger.info('Creating the Nuxt-Vite project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && npm init nuxt-app@latest client && cd client && npm i -D nuxt-vite && npm i mongoose && exit";')
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
            await validate('@quasar/cli')
            logger.info('Creating the Quasar project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "quasar create client && cd client && npm i && npm i mongoose && exit";')
            module.exports.template = 'Quasar'
        }
    } else if (template_FRONTEND === 'Vue 3️⃣') {
        await validate('@vue/cli')
        logger.info('Creating the Vue-Vite project 📃')
        shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && vue create client && cd client && npm install && npm i @vitejs/plugin-vue && vue add vite && npm i mongoose && exit";')
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
            await validate('vue-native-cli')
            await validate('expo-cli')
            logger.info('Creating the VueNative project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && vue-native init client && npm install && npm i mongoose && exit";')
            module.exports.template = 'Vue native'
        }
        if (template_Mobile === 'Ionic 2️⃣') {
            await validate('@ionic/cli@latest')
            await validate('@ionic/cli@latest native-run cordova-res')
            logger.info('Creating the VueNative project 📃')
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && ionic start client tabs --type vue --capacitor && npm install && npm i mongoose && exit";')
            module.exports.template = 'Ionic'
        }
    } else if (template_FRONTEND === 'Multi Platform 5️⃣') {
        await validate('electron@latest')
        logger.info('Creating the Electron project 📃')
        shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && vue create client && cd client && vue add electron-builder && npm install && npm i mongoose && exit";')
        module.exports.template = 'Multi Platform'
    }
    //#endregion
}
