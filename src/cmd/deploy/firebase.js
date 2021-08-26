'use strict'
//import fs from 'fs-extra'
//import path from 'path'
import * as logger from '../../preload/logger'
import { validateInstallation } from '../../preload/validate'
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
        /*fs.copySync(path.resolve(__dirname, '../../templates/deploy/firebase.json'), 'firebase.json')
        fs.writeFileSync(
            'firebase.json',
            `{
                "hosting": {
                  "public": "dist"
                },
                "rewrites": [
                    {
                      "source": "/client",
                      "destination": "/index.html"
                    }
                ]
             }`,
        )*/
        shell.exec(`wt -w 0 -d . -p "Command Prompt" cmd /k "cd client && npm run build && firebase login && firebase init && firebase deploy hosting && exit";`)
    } else if (templateDir === 'client' || templateDir === 'server') {
        shell.cd('cd ..')
        /*fs.copySync(path.resolve(__dirname, '../../templates/deploy/firebase.json'), 'firebase.json')
        fs.writeFileSync(
            'firebase.json',
            `{
                "hosting": {
                  "public": "dist"
                },
                "rewrites": [
                    {
                      "source": "/client",
                      "destination": "/index.html"
                    }
                ]
             }`,
        )*/
        shell.exec('wt -w 0 -d . -p "Command Prompt" cmd /k "cd client && npm run build && firebase login && firebase init && firebase deploy hosting && exit";')
    }
}
