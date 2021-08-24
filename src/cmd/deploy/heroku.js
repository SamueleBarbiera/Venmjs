'use strict'
import execa from 'execa'
import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import * as logger from '../../preload/logger'
import { validateInput, validateInstallation } from '../../preload/validate'
const template = require('../create/index')

/**
 * @param {String} dir - Directory of choice
 * @returns {Promise<void>}
 */

const createHerokuApp = async (dir) => {
    const { appName } = await inquirer.prompt({
        name: 'appName',
        type: 'input',
        message: 'Enter a name for the app 🌌',
        validate: validateInput,
    })

    try {
        await execa.command(`heroku create ${appName}`, { cwd: dir })
    } catch ({ stderr }) {
        logger.error(`\n${stderr}\n`)
        await createHerokuApp(dir)
    }
}

/**
 * @returns {Boolean}
 */

const isLoggedIn = async () => {
    try {
        await execa.command('heroku whoami')
        return true
    } catch (err) {
        return false
    }
}

/**
 * @param {String} configVar - The config variable
 * @param {String} dir - Directory of choice
 * @param {String} value - Supply the value
 * @returns {Promise<void>}
 */

const setConfigVar = async (configVar, dir, value) => {
    const { stdout } = await execa.command('heroku config', {
        cwd: dir,
    })
    if (!stdout.includes(configVar)) {
        if (configVar === 'DB_URL') {
            const { uri } = await inquirer.prompt({
                type: 'password',
                name: 'uri',
                message: 'Please provide the path to a cloud based MongoDB URI 🧾',
                validate: validateInput,
            })
            value = uri
        }
        await execa.command(`heroku config:set ${configVar}=${value}`, {
            cwd: dir,
        })
    }
}

/**
 * Deploy the webapp to Heroku
 *
 * @param {String} templateDir - client/server
 * @returns {Promise<void>}
 */

export default async (templateDir) => {
    await validateInstallation('heroku')
    await validateInstallation('git help -g')

    if (!fs.existsSync(path.join(templateDir, '.git'))) {
        await execa.command('git init', { cwd: templateDir })
        const fileContent = fs.existsSync(path.join('server', '.env')) ? 'node_modules\n.env' : 'node_modules'
        fs.writeFileSync(path.join(templateDir, '.gitignore'), fileContent)
    } else {
        const { stdout } = await execa.command('git status', { cwd: templateDir })
        if (stdout.includes('nothing to commit 📌')) {
            console.error('No changes detected! 📌')
            process.exit(1)
        }
    }
    // Show up the login prompt if not logged in
    if (!(await isLoggedIn())) {
        await execa.command('heroku login', { stdio: 'inherit', cwd: templateDir })
    }

    // Create a new Heroku app
    const { stdout } = await execa.command('git remote', { cwd: templateDir })
    if (!stdout.includes('heroku')) {
        await createHerokuApp(templateDir)
    }

    // It depends on a DBAAS
    if (templateDir === 'server' && fs.existsSync(path.join('server', 'models'))) {
        await setConfigVar('DB_URL', templateDir)
    }

    // Necessary configurations that are specific to the client side
    if (templateDir === 'client') {
        // Nuxt.js with target server
        if (template === 'Nuxt 2️⃣') {
            // Set config vars via heroku-cli
            await setConfigVar('HOST', templateDir, 'localhost')
            await setConfigVar('NODE_ENV', templateDir, 'production')

            // Create Procfile
            const procFilePath = path.join('client', 'Procfile')
            if (!fs.existsSync(procFilePath)) {
                fs.writeFileSync(procFilePath, 'web: npm run dev')
            }
        } else {
            const staticConfig = {
                root: 'dist',
                clean_urls: true,
                routes: {
                    '/**': 'index.html',
                },
            }

            const staticConfigPath = path.join('client', 'static.json')
            if (!fs.existsSync(staticConfigPath)) {
                fs.writeFileSync(staticConfigPath, JSON.stringify(staticConfig, null, 2))
            }

            const starterSource = ['const express = require("express");', 'const serveStatic = require("serve-static");', 'const path = require("path");', 'const app = express();', 'app.use(serveStatic(path.join(__dirname, "dist")));', 'const port = process.env.PORT || 80;', 'app.listen(port);']

            let pkgJson = JSON.parse(fs.readFileSync(path.join('client', 'package.json'), 'utf8'))
            const buildCmd = 'npm run build'
            const postInstallScript = `if test \"$NODE_ENV\" = \"production\" ; then ${buildCmd} ; fi ` // eslint-disable-line
            pkgJson = {
                ...pkgJson,
                scripts: {
                    ...pkgJson.scripts,
                    postinstall: postInstallScript,
                    start: 'node server.js',
                },
            }

            const serverFilePath = path.join('client', 'server.js')
            if (!fs.existsSync(serverFilePath)) {
                fs.writeFileSync(serverFilePath, starterSource.join('\n'))

                // Add preinstall script
                pkgJson.scripts['preinstall'] = 'npm install --save express serve-static'

                fs.writeFileSync('./client/package.json', JSON.stringify(pkgJson, null, 2))
            }
        }
    }

    await execa.command('git add .', { cwd: templateDir })
    await execa('git', ['commit', '-m', 'Add files'], { cwd: templateDir })

    await execa.command('git push heroku master', {
        stdio: 'inherit',
        cwd: templateDir,
    })
    await execa.command('heroku open', { cwd: templateDir })
}
