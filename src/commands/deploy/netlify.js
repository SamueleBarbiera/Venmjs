'use strict'
import fs from 'fs-extra'
import path from 'path'
import * as logger from '../../utils/logger'
import { validateInstallation } from '../../utils/validate'
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
    if (templateDir !== 'client' || templateDir !== 'server') {
        fs.copySync(path.resolve(__dirname, '../../templates/deploy/netlify.toml'), 'netlify.toml')
        fs.writeFileSync(
            'netlify.toml',
            `[build]
                command = "npm run build"
                publish="dist"
                base = ""
                # The base directory should be the path to the nested Vue project
            
             [[redirects]]
                from = "/*"
                to = "/index.html"
                status = 200`,
        )
        shell.exec(`wt -w 0 -d . -p "Command Prompt" cmd /k "cd client && npm run build && netlify deploy --open && netlify deploy --prod && exit";`)
    } else if (templateDir === 'client' || templateDir === 'server') {
        shell.cd('cd ..')
        fs.copySync(path.resolve(__dirname, '../../templates/deploy/netlify.toml'), 'netlify.toml')
        fs.writeFileSync(
            'netlify.toml',
            `[build]
                command = "npm run build"
                publish="dist"
                base = ""
                # The base directory should be the path to the nested Vue project
            
             [[redirects]]
                from = "/*"
                to = "/index.html"
                status = 200`,
        )
        shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd client && npm run build && netlify deploy --open && netlify deploy --prod && exit";')
    }
}
