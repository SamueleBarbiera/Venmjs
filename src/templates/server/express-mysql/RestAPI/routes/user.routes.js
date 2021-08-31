module.exports = (app) => {
    const users = require('../controllers/user.controller.js')

    // Create a new Customer
    app.post('/users', users.create)

    // Retrieve all Users
    app.get('/users', users.findAll)

    // Retrieve a single Customer with usersid
    app.get('/users/:usersid', users.findOne)

    // Update a Customer with usersid
    app.put('/users/:usersid', users.update)

    // Delete a Customer with usersid
    app.delete('/users/:usersid', users.delete)

    // Create a new Customer
    app.delete('/users', users.deleteAll)
}
