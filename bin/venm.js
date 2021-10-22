#! /usr/bin/env node
/* eslint-disable no-global-assign */
/*
require('../lib/cli.js')
*/
require = require('esm')(module)
module.exports = require('../src/cli')
