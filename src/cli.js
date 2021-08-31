#!/usr/bin/env node
'use strict'
import '@babel/polyfill'
import program from 'commander'
import updateNotifier from 'update-notifier'
import dependencies from './commands/dependencies'
import deploy from './commands/deploy'
import dockerize from './commands/dockerize'
import create from './commands/create'
import start from './commands/start'
import pkg from '../package'

updateNotifier({ pkg }).notify()

program.version(pkg.version).usage(', options listed below 👇')
program.command('create <appname>').description('Create a FULLSTACK project 🚀 (Frontend - Backend - Api - Database) [ WORKS ✅ ]').action(create)
program.command('start').description('Start the client side or the server side locally 🏁 [ WORKS ✅ ]').action(start)
program.command('dockerize').description('Create a multicontainer for your app with Docker 🐳 [ WORKS ✅ ]').action(dockerize)
program.command('deploy').description('Deploy the webapp on a cloud platform of choice 🌐 [ WORKS ✅ ]').action(deploy)
program.command('dep').description('Install dependencies on the current project 🧰 [ ⛔⏳🔜 ]').action(dependencies)
program.command('v').description('Check the version of your venm-cli [WORKS ✅]')

program.parse(process.argv)
if (!program.args.length) {
    program.help()
}
