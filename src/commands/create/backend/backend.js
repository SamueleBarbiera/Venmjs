/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
'use strict'
import inquirer from 'inquirer'
import { mongo } from './mongo.js'
import { mysql } from './mysql.js'

export async function backend() {
    //ISTRUZIONI INIZIALI

    //#region BACKEND SERVER API DATABASE
    const { template_database } = await inquirer.prompt([
        {
            name: 'template_database',
            type: 'list',
            message: 'Please choose a DATABASE ✨',
            choices: ['Mongo 1️⃣', 'mysql 2️⃣'],
        },
    ])
    if (template_database === 'Mongo 1️⃣') {
        //await validateInstallation('mongo')
        //await validateInstallation('graphql')
        await mongo()
    } else {
        //await validateInstallation('xampp')
        //await validateInstallation('mysql2')
        //await validateInstallation('graphql')
        await mysql()
    }
    //#endregion
}
