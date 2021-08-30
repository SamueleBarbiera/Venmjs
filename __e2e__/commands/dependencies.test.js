/* eslint-disable no-undef */
import { runPromptWithAnswers, rmTempDir } from '../../jest/helpers'
import { DOWN, ENTER } from 'cli-prompts-test'
import fs from 'fs'
import path from 'path'

describe('venm dependencies', () => {
    const tempDirPath = path.join(__dirname, 'add-cmd')
    const genPath = path.join(tempDirPath, 'my-app')

    // The client directory
    const clientPath = path.join(genPath, 'client')

    // The server directory
    const serverPath = path.join(genPath, 'server')

    // Cleanup
    beforeAll(() => {
        rmTempDir(tempDirPath)
        fs.mkdirSync(tempDirPath)
    })

    afterAll(() => rmTempDir(tempDirPath))

    it('installs the respective dependency passed as an arg', async () => {
        const { exitCode } = await runPromptWithAnswers(['dependencies', 'v-tooltip'], [ENTER], genPath)
        expect(exitCode).toBe(0)
        // package.json
        const pkgJson = JSON.parse(fs.readFileSync(path.join(clientPath, 'package.json')))
        expect(pkgJson.dependencies['v-tooltip']).toBeTruthy()
    })

    it('installs the respective devDependency passed as an arg for the server directory', async () => {
        const { exitCode } = await runPromptWithAnswers(['dependencies', 'husky', '--dev'], [`${DOWN}${ENTER}`], genPath)

        expect(exitCode).toBe(0)

        // package.json
        const pkgJson = JSON.parse(fs.readFileSync(path.join(serverPath, 'package.json')))
        expect(pkgJson.devDependencies['husky']).toBeTruthy()
    })

    it('shows a warning if no args were passed in for server directory', async () => {
        const { exitCode, stderr } = await runPromptWithAnswers(
            ['dependencies'],
            [`${DOWN}${ENTER}`], // opts for server directory
            genPath,
        )
        expect(exitCode).toBe(1)
        expect(stderr).toContain('Please specify the dependencies to install')

        // Delete generated directory
        rmTempDir(genPath)
    })

    it('shows a warning if no args were passed in for a starter template', async () => {
        await runPromptWithAnswers(
            ['create', 'my-app'],
            [
                ENTER, // Choose Default as the starter template
                `Y${ENTER}`, // Requires server directory
            ],
            tempDirPath,
        )

        // Invoke the add command
        const { exitCode, stderr } = await runPromptWithAnswers(
            ['dependencies'],
            [ENTER], // opts for client directory
            genPath,
        )
        expect(exitCode).toBe(1)
        expect(stderr).toContain('Please specify the dependencies to install')
    })
})
