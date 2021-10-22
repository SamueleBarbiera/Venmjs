'use strict'
import fs from 'fs'
import inquirer from 'inquirer'
import showBanner from 'node-banner'
import deployToHeroku from './heroku'
import deployToNetlify from './netlify'
import deployToFirebase from './firebase'
import { dirOfChoice } from '../../utils/helpers'
import { validateInstallation } from '../../utils/validate'
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
                choices: ['Heroku', 'Netlify', 'Firebase'],
            },
        ])

        if (platform === 'Heroku') {
            return deployToHeroku(templateDir)
        } else if (platform === 'Netlify') {
            await validateInstallation('netlify')
            return deployToNetlify(templateDir)
        } else if (platform === 'Firebase') {
            await validateInstallation('firebase')
            return deployToFirebase(templateDir)
        }
        module.exports.templateDir = 'client'
    } else {
        const { platform } = await inquirer.prompt([
            {
                name: 'platform',
                type: 'list',
                message: 'Choose your preferred platform 📍',
                choices: ['Heroku', 'Firebase'],
            },
        ])
        if (platform === 'Heroku') {
            return deployToHeroku(templateDir)
        } else if (platform === 'Firebase') {
            await validateInstallation('firebase')
            return deployToFirebase(templateDir)
        }
    }
}
