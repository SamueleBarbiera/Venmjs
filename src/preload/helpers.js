import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
const isWin = process.platform === 'win32'

/**
 * Warns appropriately if the config file doesn't exist
 * @returns {Void}
 * Copy files
 * @param {any} source - source directory path
 * @param {any} target - path to the destination directory
 * @returns {Void}
 */

export const fetchProjectConfig = (genPath) => {
    const configFilePath = genPath ? path.join(genPath, '.mevnrc') : '.mevnrc'
    if (!fs.existsSync(configFilePath)) {
        return
    }
    return JSON.parse(fs.readFileSync(configFilePath, 'utf8'))
}

const copyFileSync = (source, target) => {
    let targetFile = target

    // if target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source))
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source))
}

/**
 * Copy directory content recursively
 * @param {any} source - source directory path
 * @param {any} target - path to the destination directory
 * @returns {Void}
 */
export const copyDirSync = (source, target) => {
    // check if folder needs to be created or integrated
    const targetFolder = path.join(target, path.basename(source))
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder)
    }

    // copy
    if (fs.lstatSync(source).isDirectory()) {
        fs.readdirSync(source).forEach((file) => {
            const curSource = path.join(source, file)
            if (fs.lstatSync(curSource).isDirectory()) {
                copyDirSync(curSource, targetFolder)
            } else {
                copyFileSync(curSource, targetFolder)
            }
        })
    }
}

/**
 * Choose between client and server directories
 *
 * @returns {Promise<object>}
 */

export const dirOfChoice = () => {
    return inquirer.prompt({
        name: 'dir',
        type: 'list',
        message: 'Choose from below',
        choices: ['client', 'server'],
    })
}

/**
 * Strips \r character from the file content if the host OS is windows
 *
 * @param {String[]} fileContent - The file content
 * @returns {String[]}
 */

const stripChar = (fileContent) => fileContent.map((content) => (content.includes('\r') ? content.substr(0, content.indexOf('\r')) : content))
/**
 * Returns the file content as an arrray
 *
 * @param {String} filePath - The file path
 * @returns {String[]}
 */

export const readFileContent = (filePath) => {
    if (!filePath) {
        return
    }
    const fileContent = fs.readFileSync(filePath, 'utf8').split('\n')

    // Check if the host OS is windows
    if (isWin) {
        return stripChar(fileContent)
    }
    return fileContent
}
