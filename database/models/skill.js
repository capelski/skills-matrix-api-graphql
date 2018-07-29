const skillDefinition = (dbConnection, Sequelize) =>
    dbConnection.define('skill', {
        Id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Name: Sequelize.TEXT
    }, {
        freezeTableName: true
    });

const skillAssociations = models =>
    models.Skill.belongsToMany(models.Employee, {
        through: 'employee_skill',
        as: 'Employees',
        foreignKey: 'skillId'
    });

module.exports = {
    skillAssociations,
    skillDefinition
};