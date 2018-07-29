const employeeDefinition = (dbConnection, Sequelize) =>
    dbConnection.define('employee', {
        Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Name: Sequelize.TEXT
    }, {
        freezeTableName: true
    });

const employeeAssociations = models =>
    models.Employee.belongsToMany(models.Skill, {
        through: 'employee_skill',
        as: 'Skills',
        foreignKey: 'employeeId'
    });

module.exports = {
    employeeAssociations,
    employeeDefinition
};