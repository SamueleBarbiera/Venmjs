/* eslint-disable no-unused-vars */
'use strict'
import chalk from 'chalk'
import execa from 'execa'
import inquirer from 'inquirer'
import exec from './exec'
import ora from 'ora'
const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'
const isMac = process.platform === 'darwin'
class Spinner {
    constructor(text) {
        this.text = text
    }
    start() {
        this.spinner = ora(this.text).start()
    }
    info(text) {
        this.spinner.info(text)
    }
    succeed(text) {
        this.spinner.succeed(text)
    }
    fail(text) {
        this.spinner.fail(text)
    }
    stop() {
        this.spinner.stop()
    }
}
const spinner = new Spinner()

/**
 * Shows installation information
 * @param {String} depCandidate - The repective package to be installed
 * @param {String} url - Official downloads page url
 * @returns {Void}
 * -------------------------------------------------------------------------
 * Helper method to validate installation
 * @param {String} dependency
 * @returns {Promise<boolean>}
 * -------------------------------------------------------------------------
 * Install Git for supported platforms, else show installation instructions
 * @returns {Promise<void>}
 * -------------------------------------------------------------------------
 * Install Docker for Linux platform, else show installation instructions
 * @returns {Promise<void>}
 * -------------------------------------------------------------------------
 * Validates user input for input prompts
 * @param {String} userInput
 * @returns {Boolean}
 * -------------------------------------------------------------------------
 * Checks if a necessary dependency is installed
 * @param {String} dependency
 * @returns {Promise<Void>}
 */

//#region region VALIDATE INPUT
export const validateInput = (userInput) => {
    if (!userInput) {
        return `Can't be empty!`
    }
    return true
}

export const validateInputname = (userInput) => {
    if (!userInput) {
        return `Can't be empty!`
    }
    return true
}

export const validateInputhost = (userInput) => {
    if (!userInput) {
        return `Can't be empty!`
    }
    return true
}

export const validateInputdb = (userInput) => {
    if (!userInput) {
        return `Can't be empty!`
    }
    return true
}

export const validateInputuser = (userInput) => {
    if (!userInput) {
        return `Can't be empty!`
    }
    return true
}

export const validateInputpass = (userInput) => {
    if (!userInput) {
        return `Can't be empty!`
    }
    return true
}
//#endregion

const showInstallationInfo = (depCandidate, url) => {
    const msg = ` You need to download ${depCandidate} from the official downloads page: ${url}`
    console.log(chalk.cyan.bold(msg))
    process.exit(0)
}

const checkInstallationStatus = async (dependency) => {
    try {
        await execa.command(dependency)
        return true
    } catch (err) {
        return false
    }
}

//#region INSTALL PACKAGES
const installGit = () => {
    const url = 'https://git-scm.com/download/win'

    if (isWin) {
        return showInstallationInfo('git', url)
    } else if (isLinux) {
        return exec(`apt install -g git`)
    } else if (isMac) {
        return exec(`brew install git`)
    }
}

const installDocker = () => {
    const urlMap = {
        win32: 'https://hub.docker.com/editions/community/docker-ce-desktop-windows',
        darwin: 'https://docs.docker.com/docker-for-mac/install/',
    }
    if (!isLinux) {
        return showInstallationInfo('docker', urlMap[process.platform])
    }
    return exec('apt install docker.io')
}

const installYarn = () => {
    return exec(`npm install --global yarn`)
}
const installwt = () => {
    const urlMap = {
        win32: 'https://www.microsoft.com/store/productId/9N0DX20HK701',
    }
    if (isWin) {
        return showInstallationInfo('wt', urlMap[process.platform])
    }
}
const installfirebase = () => {
    return exec(`npm i -g firebase-tools`)
}
const installnetlify = () => {
    return exec(`npm i netlify-cli -g`)
}

//#endregion

export const validateInstallation = async (dependency) => {
    const isDepInstalled = await checkInstallationStatus(dependency)

    if (dependency.includes(' ')) {
        const sep = dependency.includes('-') ? '-' : ''
        dependency = dependency.split(sep)[0]
    }

    if (!isDepInstalled) {
        const { shouldInstallDep } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'shouldInstallDep',
                message: `Sorry, ${dependency} is not installed on your system, Do you want to install it?`,
            },
        ])

        if (!shouldInstallDep) {
            console.warn(chalk.yellow.bold(` Warning:- ${chalk.cyan.bold(`${dependency} is required to be installed`)}`))
            process.exit(1)
        }

        spinner.text = `The installation of ${dependency} is starting`
        spinner.start()
        if (dependency === 'yarn') {
            return installGit()
        }
        if (dependency === 'git') {
            return installYarn()
        }
        if (dependency === 'docker') {
            return installDocker()
        }
        if (dependency === 'wt') {
            return installwt()
        }

        if (dependency === 'firebase') {
            return installfirebase()
        }
        if (dependency === 'netlify') {
            return installnetlify()
        }

        await exec(`npm install -g ${dependency}`)
    }
}
