const Customer = require('../models/user.model.js')

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    // Create a Customer
    const user = new Customer({
        email: req.body.email,
        name: req.body.name,
        active: req.body.active,
    })

    // Save Customer in the database
    Customer.create(user, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Customer.',
            })
        else res.send(data)
    })
}

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    Customer.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving users.',
            })
        else res.send(data)
    })
}

// Find a single Customer with a usersid
exports.findOne = (req, res) => {
    Customer.findById(req.params.usersid, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(404).send({
                    message: `Not found Customer with id ${req.params.usersid}.`,
                })
            } else {
                res.status(500).send({
                    message: 'Error retrieving Customer with id ' + req.params.usersid,
                })
            }
        } else res.send(data)
    })
}

// Update a Customer identified by the usersid in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: 'Content can not be empty!',
        })
    }

    console.log(req.body)

    Customer.updateById(req.params.usersid, new Customer(req.body), (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(404).send({
                    message: `Not found Customer with id ${req.params.usersid}.`,
                })
            } else {
                res.status(500).send({
                    message: 'Error updating Customer with id ' + req.params.usersid,
                })
            }
        } else res.send(data)
    })
}

// Delete a Customer with the specified usersid in the request
exports.delete = (req, res) => {
    Customer.remove(req.params.usersid, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                res.status(404).send({
                    message: `Not found Customer with id ${req.params.usersid}.`,
                })
            } else {
                res.status(500).send({
                    message: 'Could not delete Customer with id ' + req.params.usersid,
                })
            }
        } else res.send({ message: `Customer was deleted successfully!` })
    })
}

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    Customer.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || 'Some error occurred while removing all users.',
            })
        else res.send({ message: `All Users were deleted successfully!` })
    })
}
