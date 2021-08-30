/* eslint-disable no-undef */
'use strict'
import { run } from '../../jest/helpers'
import envinfo from 'envinfo'

describe('venm info', () => {
    it('logs local environment information', async () => {
        const { exitCode, stdout } = run(['info'])
        const data = await envinfo.run({
            System: ['OS', 'CPU'],
            Binaries: ['Node', 'Yarn', 'npm'],
            Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
            npmGlobalPackages: ['venm-cli'],
        })
        expect(exitCode).toBe(0)
        expect(stdout).toContain(data)
    })
})
