'use strict'
import fs from 'fs-extra'
import path from 'path'
const { exec } = require('child_process')
import * as logger from '../../preload/logger'
import { validateInstallation } from '../../preload/validate'
const templateDir = require('../create/index')
const appName = require('../create/index')
let shell = require('shelljs')
/**
 * Deploy the webapp to netlify
 * @param {String} configFile - File whose content is to be read
 * @returns {String[]}
 * @returns {Promise<void>}
 */

export default async (templateDir) => {
    await validateInstallation('netlify')
    await validateInstallation('git help -g')

    logger.info('Deploying the client side project 📃')
    if (templateDir != 'client' || templateDir != 'server') {
        fs.copySync(path.resolve(__dirname, '../../templates/deploy/netlify.toml'), 'netlify.toml')
    } else if (templateDir === 'client' || templateDir === 'server') {
        shell.cd('cd ..')
        fs.copySync(path.resolve(__dirname, '../../templates/deploy/netlify.toml'), 'netlify.toml')
    }

    if (templateDir != 'client') {
        shell.cd('./client')
    } else if (templateDir === 'server') {
        shell.cd('cd .. && cd client')
    }
    shell.exec('start cmd /k "netlify deploy --open && netlify deploy --prod" ')
    
}
