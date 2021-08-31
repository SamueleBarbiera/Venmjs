/* eslint-disable no-undef */
'use strict'
import { run } from '../jest/helpers'

describe('Default behavior', () => {
    it('warns the user if an unknown option is passed in', () => {
        const { exitCode, stderr } = run(['--invalid'], { reject: false })
        expect(exitCode).toBe(1)
        expect(stderr).toBe(`error: unknown option '--invalid'`)
    })

    it('warns the user if an unknown command is passed in', () => {
        const { exitCode, stderr } = run(['init'], { reject: false })
        expect(exitCode).toBe(1)
        expect(stderr.trim()).toBe('Unknown command init.')
        expect(stderr).toContain('Did you mean create?')
    })

    it('suggests the closest match for an unknown command', () => {
        const { exitCode, stderr } = run(['docker'], { reject: false })
        expect(exitCode).toBe(1)
        expect(stderr).toContain('Did you mean dockerize?')
    })

    it('suggests the closest match for an unknown command', () => {
        const { exitCode, stderr } = run(['dep', 'add'], { reject: false })
        expect(exitCode).toBe(1)
        expect(stderr).toContain('Did you mean dependencies?')
    })

    it('suggests the closest match for an unknown command', () => {
        const { exitCode, stderr } = run(['serve', 'run'], { reject: false })
        expect(exitCode).toBe(1)
        expect(stderr).toContain('Did you mean start?')
    })
})
