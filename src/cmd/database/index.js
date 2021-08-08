'use strict'
import showBanner from 'node-banner'

/**
 * @returns {Void}
 * @param {String} appName 
 * @returns {Promise<void>}
 */

export default async (appName) => {
    await showBanner('DATABASE   SECTION   NOT   READY','-------------------------------------------------------------------------------','red', 'red')
}
