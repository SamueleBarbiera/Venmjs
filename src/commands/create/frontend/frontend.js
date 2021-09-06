/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
'use strict'
import inquirer from 'inquirer'
import * as logger from '../../../utils/logger'
const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'
const isMac = process.platform === 'darwin'
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
            logger.info('Creating the Vuepress project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && npx create-vuepress-site client && npm add --dev vitepress && npm i && npm i mongoose && exit";')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "npx create-vuepress-site client; npm add --dev vitepress; npm install; npm i mongoose; killall Terminal"
                end tell'`)
            }
            module.exports.template = 'Vuepress'
        }
        if (template_SSG_Jam === 'Gridsome 2️⃣') {
            logger.info('Creating the Gridsome project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && gridsome create client && npm i && npm i mongoose && exit";')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "gridsome create client; npm install; npm i mongoose; killall Terminal"
                end tell'`)
            }
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
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && npm init nuxt-app@latest client && npm i -D nuxt-vite && npm i mongoose && exit";')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "npm init nuxt-app@latest client; npm i -D nuxt-vite; npm install; npm i mongoose; killall Terminal"
                end tell'`)
            }
            logger.info(`Insert in nuxt.config 👉 buildModules: ['nuxt-vite']`)
            module.exports.template = 'Nuxt'
        }
        if (template_SSR === 'Quasar 2️⃣') {
            logger.info('Creating the Quasar project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && quasar create client && npm i && npm i mongoose && exit";')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "quasar create client; npm install; npm i mongoose; killall Terminal"
                end tell'`)
            }
            module.exports.template = 'Quasar'
        }
    } else if (template_FRONTEND === 'Vue 3️⃣') {
        logger.info('Creating the Vue-Vite project 📃')
        if (isWin) {
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && vue create client && npm install && npm i @vitejs/plugin-vue && vue add vite && npm i mongoose && exit";')
        } else if (isMac || isLinux) {
            shell.exec(`osascript -e 'tell app "Terminal"
            do script "vue create client; npm install; npm i @vitejs/plugin-vue; vue add vite; npm i mongoose; killall Terminal"
        end tell'`)
        }
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
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && vue-native init client && npm install && npm i mongoose && exit";')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "vue-native init client; npm install; npm i mongoose; killall Terminal"
                end tell'`)
            }
            module.exports.template = 'Vue native'
        }
        if (template_Mobile === 'Ionic 2️⃣') {
            logger.info('Creating the VueNative project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && ionic start client tabs --type vue --capacitor && npm install && npm i mongoose && exit";')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "sh -c "ionic start client tabs --type vue --capacitor; npm install; npm i mongoose; killall Terminal"
                end tell'`)
            }
            module.exports.template = 'Ionic'
        }
    } else if (template_FRONTEND === 'Multi Platform 5️⃣') {
        logger.info('Creating the Electron project 📃')
        if (isWin) {
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && vue create client && vue add electron-builder && npm install && npm i mongoose && exit";')
        } else if (isMac || isLinux) {
            shell.exec(`osascript -e 'tell app "Terminal"
            do script "vue create client; vue add electron-builder; npm install; npm i mongoose; killall Terminal"
            end tell'`)
        }
        module.exports.template = 'Multi Platform'
    }
    //#endregion
}
