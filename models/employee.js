const employeeDefinition = (dbConnection, Sequelize) =>
    dbConnection.define('employee', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: Sequelize.TEXT
    }, {
        freezeTableName: true
    });

const employeeAssociations = models =>
    models.Employee.belongsToMany(models.Skill, {
        through: 'employee_skill',
        as: 'skills',
        foreignKey: 'employeeId'
    });

module.exports = {
    employeeAssociations,
    employeeDefinition
};