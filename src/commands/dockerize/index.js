'use strict'
import execa from 'execa'
import fs from 'fs'
import path from 'path'
import showBanner from 'node-banner'
import { readFileContent } from '../../utils/helpers'
import { validateInstallation } from '../../utils/validate'

/**
 * @param {String} configFile - File whose content is to be read
 * @returns {String[]}
 * Make data directory for mongo container to mount in order to persist the database.
 * @returns {void}
 * Launch multiple containers with docker-compose (client, server and mongo client)
 * @returns {Promise<void>}
 */

const getFileContent = (configFile) => {
    // Holds reference to the path where docker-config files reside
    const dockerConfigTemplatePath = path.join(__dirname, '..', '..', 'templates', 'docker', configFile)
    return readFileContent(dockerConfigTemplatePath)
}

export default async () => {
    await showBanner('VENM', 'Docker process is starting 🐳', 'blue', 'white')
    await validateInstallation('docker')
    let dockerComposeTemplate = getFileContent('docker-compose.yml')
    let dockerFileTemplate = getFileContent('Dockerfile')
    const clientDockerFilePath = path.join('client', 'Dockerfile')
    if (!fs.existsSync(clientDockerFilePath)) {
        // docker-compose.yml
        dockerComposeTemplate[4] = `${' '.repeat(4)}command: bash -c "npm install && npm i mongoose && npm run dev"`
        dockerComposeTemplate[9] = `${' '.repeat(6)}- "8080:8080"`
        fs.writeFileSync(clientDockerFilePath, dockerFileTemplate.join('\n'))
    }
    console.log('1')

    if (fs.existsSync('server')) {
        // Create Dockerfile for server directory
        const serverDockerFilePath = path.join('server', 'Dockerfile')
        if (!fs.existsSync(serverDockerFilePath)) {
            fs.writeFileSync(serverDockerFilePath, dockerFileTemplate.join('\n'))
        }

        // Create .dockerignore within server directory
        const serverDockerIgnorePath = path.join('server', '.dockerignore')
        const clientDockerIgnorePath = path.join('client', '.dockerignore')
        if (!fs.existsSync(serverDockerIgnorePath)) {
            fs.writeFileSync(serverDockerIgnorePath, 'node_modules')
        }
        if (!fs.existsSync(clientDockerIgnorePath)) {
            const dockerIgnoreContent = 'node_modules\ndist'
            fs.writeFileSync(clientDockerIgnorePath, `${dockerIgnoreContent}`)
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
