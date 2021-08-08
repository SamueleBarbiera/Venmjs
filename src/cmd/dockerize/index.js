'use strict'
import execa from 'execa'
import fs from 'fs'
import path from 'path'
import showBanner from 'node-banner'
import { readFileContent } from '../../preload/helpers'
import { validateInstallation } from '../../preload/validate'
const template = require('../create/index')

/**
 * @param {String} configFile - File whose content is to be read
 * @returns {String[]}
 */

const getFileContent = (configFile) => {
    // Holds reference to the path where docker-config files reside
    const dockerConfigTemplatePath = path.join(__dirname, '..', '..', 'templates', 'docker', configFile)
    return readFileContent(dockerConfigTemplatePath)
}

/**
 * Make data directory for mongo container to mount in order to persist the database.
 * @returns {void}
 */
const makeDataDir = () => {
    fs.mkdirSync(path.join('tmp', 'data'), { recursive: true })
    let gitIgnoreContents = ['# VENM_GENERATED:MONGO', '/tmp', '\n'].join('\n')
    if (fs.existsSync('.gitignore')) {
        const mongoGitIgnoreHeader = '# VENM_GENERATED:MONGO'
        gitIgnoreContents = fs.readFileSync('.gitignore', 'utf8')
        if (new RegExp(mongoGitIgnoreHeader, 'g').test(gitIgnoreContents)) {
            return
        }
        gitIgnoreContents += ['\n', '# VENM_GENERATED:MONGO', '/tmp', '\n'].join('\n')
    }
    fs.writeFileSync('.gitignore', gitIgnoreContents)
}

/**
 * Launch multiple containers with docker-compose (client, server and mongo client)
 * @returns {Promise<void>}
 */

export default async () => {
    await showBanner('VENM', 'Docker process is starting 🐳', 'blue', 'white')
    await validateInstallation('docker')
    let dockerComposeTemplate = getFileContent('docker-compose.yml')
    let dockerFileTemplate = getFileContent('Dockerfile')
    const clientDockerFilePath = path.join('client', 'Dockerfile')
    if (!fs.existsSync(clientDockerFilePath)) {
        if (template === 'Nuxt 2️⃣') {
            // docker-compose.yml
            dockerComposeTemplate[4] = `${' '.repeat(4)}command: bash -c "npm install && npm i mongoose && npm run dev"`
            dockerComposeTemplate[9] = `${' '.repeat(6)}- "8080:8080"`
            dockerComposeTemplate.splice(10, 0, `${' '.repeat(4)}environment:- PORT=8080`)
            dockerComposeTemplate.splice(11, 0, `${' '.repeat(6)}HOST: localhost`)
        }
        fs.writeFileSync(clientDockerFilePath, dockerFileTemplate.join('\n'))
    }

    if (fs.existsSync('server')) {
        // Create Dockerfile for server directory
        const serverDockerFilePath = path.join('server', 'Dockerfile')
        if (!fs.existsSync(serverDockerFilePath)) {
            fs.writeFileSync(serverDockerFilePath, dockerFileTemplate.join('\n'))
        }

        // Create .dockerignore within server directory
        const serverDockerIgnorePath = path.join('server', '.dockerignore')
        if (!fs.existsSync(serverDockerIgnorePath)) {
            fs.writeFileSync(serverDockerIgnorePath, 'node_modules')
        }

        // Configure env variables for CRUD boilerplate template to be consumed within the Docker container
        if (fs.existsSync(path.join('server', 'models'))) {
            if (!fs.existsSync(path.join('tmp', 'data'))) {
                makeDataDir()

                // dockerize command was invoked after generating the CRUD boilerplate
                if (fs.existsSync('docker-compose.yml')) {
                    // Content to be inserted towards the end of docker-compose.yml
                    const mongoDBConfig = [`${' '.repeat(4)}depends_on:`, `${' '.repeat(6)}- mongo`, '', `${' '.repeat(2)}mongo:`, `${' '.repeat(4)}image: mongo`, `${' '.repeat(4)}volumes:`, `${' '.repeat(6)}- ./tmp/data:/data/db`, `${' '.repeat(4)}ports:`, `${' '.repeat(6)}- "27017:27017"`]
                    dockerComposeTemplate = fs.readFileSync('docker-compose.yml', 'utf8').split('\n')
                    dockerComposeTemplate = [].concat(dockerComposeTemplate, mongoDBConfig)
                    const startIdx = dockerComposeTemplate.findIndex((line) => line.trim() === '- ./server:/app')
                    dockerComposeTemplate.splice(startIdx + 1, 0, `${' '.repeat(4)}environment:- PORT=27017`)
                    dockerComposeTemplate.splice(startIdx + 2, 0, `${' '.repeat(6)}- DB_URL=mongodb://mongo:27017/userdb`)
                    fs.writeFileSync('docker-compose.yml', dockerComposeTemplate.join('\n'))
                }
            } else {
                const endIdx =  template === 'Nuxt 2️⃣' ? 21 : 19
                dockerComposeTemplate = dockerComposeTemplate.slice(0, endIdx)
            }
        }

        const clientDockerIgnorePath = path.join('client', '.dockerignore')
        if (!fs.existsSync(clientDockerIgnorePath)) {
            const dockerIgnoreContent = 'node_modules\ndist'
            fs.writeFileSync(
                clientDockerIgnorePath,
                `${template === 'Nuxt 2️⃣' 
                        ? dockerIgnoreContent + '\n.nuxt' // Add .nuxt to .dockerignore
                        : dockerIgnoreContent
                }`
            )
        }

        if (!fs.existsSync('server')) {
            dockerComposeTemplate = dockerComposeTemplate.slice(0, template === 'Nuxt 2️⃣' ? 12 : 10)
        }

        // Create docker-compose.yml at project root
        if (!fs.existsSync('docker-compose.yml')) {
            fs.writeFileSync('docker-compose.yml', dockerComposeTemplate.join('\n'))
        }

        try {
            await execa.command('docker-compose up', {
                stdio: 'inherit',
            })
        } catch (err) {
            process.exit(1)
        }
    }
}
