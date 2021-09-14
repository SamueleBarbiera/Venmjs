#!/usr/bin/env node
'use strict'
import '@babel/polyfill'
import program from 'commander'
import chalk from 'chalk'
import leven from 'leven'
import updateNotifier from 'update-notifier'
import dependencies from './commands/dependencies'
import deploy from './commands/deploy'
import dockerize from './commands/dockerize'
import create from './commands/create'
import start from './commands/start'
import start from './commands/devops'
import start from './commands/build'
import start from './commands/test'
import pkg from '../package'
import * as logger from './utils/logger'

updateNotifier({ pkg }).notify()
const suggestCommands = (cmd) => {
    const availableCommands = program.commands.map((c) => c._name)
    const suggestion = availableCommands.find((c) => leven(c, cmd) < c.length * 0.4)
    if (suggestion) {
        logger.error(` Did you mean ${chalk.yellow(suggestion)}?`)
    }
}
program.on('command:*', ([cmd]) => {
    program.outputHelp()
    logger.error(`\n Unknown command ${chalk.yellow(cmd)}.\n`)
    suggestCommands(cmd)
    process.exitCode = 1
})
program.parse(process.argv)

program.version(pkg.version).usage(', options listed below 👇')
program.command('create <appname>').description('Create a FULLSTACK project 🚀 (Frontend - Backend - Api - Database) [WORKS ✅]').action(create)
program.command('start').description('Start the client side or the server side locally 🏁 [WORKS ✅]').action(start)
program.command('dockerize').description('Create a multicontainer for your app with Docker 🐳 [WORKS ✅]').action(dockerize)
program.command('deploy').description('Deploy the webapp on a cloud platform of choice 🌐 [WORKS ✅]').action(deploy)
program.command('dep').description('Install dependencies on the current project 🧰 [⛔⏳🔜]').action(dependencies)
program.command('build').description('build a folder for the current project 🎲 [⛔⏳🔜]').action(build)
program.command('test').description('testing the current project 🎲 [⛔⏳🔜]').action(test)
program.command('devops').description('automations available on the current project 🎲 [⛔⏳🔜]').action(devops)

program.parse(process.argv)
if (!program.args.length) {
    program.help()
}
