import execa from 'execa'
import ora from 'ora'
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

/**
 * @param {String} cmd - Command to be executed
 * @param {String} progressMsg - Suitable message to show up with the spinner during execution
 * @param {String} successMsg - Suitable message to show up with the spinner on successful completion
 * @param {Object} options - Optional argument to configure execa
 * @returns {Promise<void>}
 */

export default async (cmd, progressMsg, successMsg = 'Done', options = {}) => {
    const spinner = new Spinner(progressMsg)
    spinner.start()
    try {
        await execa.command(cmd, options)
        spinner.succeed(successMsg)
    } catch (err) {
        spinner.fail('Something went wrong')
        throw err
    }
}
