export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: DataTypes.STRING,
    })

    return User
}
