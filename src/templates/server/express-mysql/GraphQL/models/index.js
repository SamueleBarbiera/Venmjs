import Sequelize from 'sequelize'

const sequelize = new Sequelize('test_graphql_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
})

const db = {
    User: sequelize.import('./user.js'),
}

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
