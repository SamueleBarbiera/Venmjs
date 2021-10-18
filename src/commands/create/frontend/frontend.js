/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
'use strict'
import inquirer from 'inquirer'
import * as logger from '../../../utils/logger'
import exec from '../../../utils/exec'
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
            choices: ['SSG/Jamstack', 'SSR', 'Vue', 'Mobile', 'Multi Platform'],
        },
    ])
    if (template_FRONTEND === 'SSG/Jamstack') {
        const { template_SSG_Jam } = await inquirer.prompt([
            {
                name: 'template_SSG_Jam',
                type: 'list',
                message: 'Please choose a SSG framework ✨',
                choices: ['Vuepress', 'Gridsome'],
            },
        ])
        if (template_SSG_Jam === 'Vuepress') {
            logger.info('Creating the Vuepress project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && npx create-vuepress-site client && cd client && npm add --dev vitepress && exit";')
                await exec('npm install', 'Installing Frontend Dependencies')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "npx create-vuepress-site client; cd client; npm add --dev vitepress; killall Terminal"
                end tell'`)
                await exec('npm install', 'Installing Frontend Dependencies')
            }
            module.exports.template = 'Vuepress'
        }
        if (template_SSG_Jam === 'Gridsome') {
            logger.info('Creating the Gridsome project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && gridsome create client && cd client && exit";')
                await exec('npm install', 'Installing Frontend Dependencies')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "gridsome create client; cd client; killall Terminal"
                end tell'`)
                await exec('npm install', 'Installing Frontend Dependencies')
            }
            module.exports.template = 'Gridsome'
        }
    } else if (template_FRONTEND === 'SSR') {
        const { template_SSR } = await inquirer.prompt([
            {
                name: 'template_SSR',
                type: 'list',
                message: 'Please choose a SSR framework ✨',
                choices: ['Nuxt', 'Quasar'],
            },
        ])
        if (template_SSR === 'Nuxt') {
            logger.info('Creating the Nuxt-Vite project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && npm init nuxt-app@latest client && cd client && npm i -D nuxt-vite && exit";')
                await exec('npm install', 'Installing Frontend Dependencies')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "npm init nuxt-app@latest client; cd client; npm i -D nuxt-vite; killall Terminal"
                end tell'`)
                await exec('npm install', 'Installing Frontend Dependencies')
            }
            logger.info(`Insert in nuxt.config 👉 buildModules: ['nuxt-vite']`)
            module.exports.template = 'Nuxt'
        }
        if (template_SSR === 'Quasar') {
            logger.info('Creating the Quasar project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && quasar create client && cd client && exit";')
                await exec('npm install', 'Installing Frontend Dependencies')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "quasar create client; cd client; killall Terminal"
                end tell'`)
                await exec('npm install', 'Installing Frontend Dependencies')
            }
            module.exports.template = 'Quasar'
        }
    } else if (template_FRONTEND === 'Vue') {
        logger.info('Creating the Vue-Vite project 📃')
        if (isWin) {
            shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && vue create client && cd client && npm i @vitejs/plugin-vue && vue add vite && exit";')
            await exec('npm install', 'Installing Frontend Dependencies')
        } else if (isMac || isLinux) {
            shell.exec(`osascript -e 'tell app "Terminal"
            do script "vue create client; cd client; npm i @vitejs/plugin-vue; vue add vite; killall Terminal"
        end tell'`)
            await exec('npm install', 'Installing Frontend Dependencies')
        }
        module.exports.template = 'Vue'
    } else if (template_FRONTEND === 'Mobile') {
        const { template_Mobile } = await inquirer.prompt([
            {
                name: 'template_Mobile',
                type: 'list',
                message: 'Please choose a MOBILE framework ✨',
                choices: ['Vue native', 'Ionic'],
            },
        ])
        if (template_Mobile === 'Vue native') {
            logger.info('Creating the VueNative project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && vue-native init client && cd client && exit";')
                await exec('npm install', 'Installing Frontend Dependencies')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "vue-native init client; cd client; killall Terminal"
                end tell'`)
                await exec('npm install', 'Installing Frontend Dependencies')
            }
            module.exports.template = 'Vue native'
        }
        if (template_Mobile === 'Ionic') {
            logger.info('Creating the VueNative project 📃')
            if (isWin) {
                shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && ionic start client tabs --type vue --capacitor && cd client && exit";')
                await exec('npm install', 'Installing Frontend Dependencies')
            } else if (isMac || isLinux) {
                shell.exec(`osascript -e 'tell app "Terminal"
                do script "sh -c "ionic start client tabs --type vue --capacitor; cd client; killall Terminal"
                end tell'`)
                await exec('npm install', 'Installing Frontend Dependencies')
            }
            module.exports.template = 'Ionic'
        }
    } else if (template_FRONTEND === 'Multi Platform') {
        logger.info('Creating the Electron project 📃')
        if (isWin) {
            await exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd .. && vue create client && cd client && vue add electron-builder && exit";')
            await exec('npm install', 'Installing Frontend Dependencies')
        } else if (isMac || isLinux) {
            await exec(`osascript -e 'tell app "Terminal"
            do script "vue create client; cd client; vue add electron-builder; killall Terminal"
            end tell'`)
            await exec('npm install', 'Installing Frontend Dependencies')
        }
        module.exports.template = 'Multi Platform'
    }
    //#endregion
}
