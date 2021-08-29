'use strict'
import fs from 'fs'
import inquirer from 'inquirer'
import showBanner from 'node-banner'
import deployToHeroku from './heroku'
import deployToNetlify from './netlify'
import deployToFirebase from './firebase'
import { dirOfChoice } from '../../preload/helpers'
//const templateDir = require('../create/index')

/**
 * Deploy the webapp to a cloud solution of choice
 * @returns {Promise<void>}
 * @param {String} platform
 * @returns {String[]}
 */

export default async () => {
    await showBanner('VENM', 'Deploying your project 🏁', 'blue', 'white')
    // Choose between client/server
    let templateDir = 'client'
    if (fs.existsSync('./server')) {
        ;({ dir: templateDir } = await dirOfChoice())
    }

    // List the various options for client side
    if (templateDir === 'client') {
        const { platform } = await inquirer.prompt([
            {
                name: 'platform',
                type: 'list',
                message: 'Choose your preferred platform 📍',
                choices: ['Heroku 1️⃣', 'Netlify 2️⃣', 'Firebase 3️⃣'],
            },
        ])

        if (platform === 'Heroku 1️⃣') {
            return deployToHeroku(templateDir)
        } else if (platform === 'Netlify 2️⃣') {
            return deployToNetlify(templateDir)
        } else if (platform === 'Firebase 3️⃣') {
            return deployToFirebase(templateDir)
        }
        module.exports.templateDir = 'client'
    } else {
        const { platform } = await inquirer.prompt([
            {
                name: 'platform',
                type: 'list',
                message: 'Choose your preferred platform 📍',
                choices: ['Heroku 1️⃣', 'Firebase 2️⃣'],
            },
        ])
        if (platform === 'Heroku 1️⃣') {
            return deployToHeroku(templateDir)
        } else if (platform === 'Firebase 2️⃣') {
            return deployToFirebase(templateDir)
        }
    }
}
