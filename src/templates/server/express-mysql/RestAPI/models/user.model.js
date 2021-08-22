const sql = require('./db.js')

// constructor
const Customer = function (user) {
    this.email = user.email
    this.name = user.name
    this.active = user.active
}

Customer.create = (newCustomer, result) => {
    sql.query('INSERT INTO users SET ?', newCustomer, (err, res) => {
        if (err) {
            console.log('error: ', err)
            result(err, null)
            return
        }

        console.log('created user: ', { id: res.insertId, ...newCustomer })
        result(null, { id: res.insertId, ...newCustomer })
    })
}

Customer.findById = (usersid, result) => {
    sql.query(`SELECT * FROM users WHERE id = ${usersid}`, (err, res) => {
        if (err) {
            console.log('error: ', err)
            result(err, null)
            return
        }

        if (res.length) {
            console.log('found user: ', res[0])
            result(null, res[0])
            return
        }

        // not found Customer with the id
        result({ kind: 'not_found' }, null)
    })
}

Customer.getAll = (result) => {
    sql.query('SELECT * FROM users', (err, res) => {
        if (err) {
            console.log('error: ', err)
            result(null, err)
            return
        }

        console.log('users: ', res)
        result(null, res)
    })
}

Customer.updateById = (id, user, result) => {
    sql.query('UPDATE users SET email = ?, name = ?, active = ? WHERE id = ?', [user.email, user.name, user.active, id], (err, res) => {
        if (err) {
            console.log('error: ', err)
            result(null, err)
            return
        }

        if (res.affectedRows == 0) {
            // not found Customer with the id
            result({ kind: 'not_found' }, null)
            return
        }

        console.log('updated user: ', { id: id, ...user })
        result(null, { id: id, ...user })
    })
}

Customer.remove = (id, result) => {
    sql.query('DELETE FROM users WHERE id = ?', id, (err, res) => {
        if (err) {
            console.log('error: ', err)
            result(null, err)
            return
        }

        if (res.affectedRows == 0) {
            // not found Customer with the id
            result({ kind: 'not_found' }, null)
            return
        }

        console.log('deleted user with id: ', id)
        result(null, res)
    })
}

Customer.removeAll = (result) => {
    sql.query('DELETE FROM users', (err, res) => {
        if (err) {
            console.log('error: ', err)
            result(null, err)
            return
        }

        console.log(`deleted ${res.affectedRows} users`)
        result(null, res)
    })
}

module.exports = Customer
