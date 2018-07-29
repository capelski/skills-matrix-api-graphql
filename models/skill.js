const skillDefinition = (dbConnection, Sequelize) =>
    dbConnection.define('skill', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: Sequelize.TEXT
    }, {
        freezeTableName: true
    });

const skillAssociations = models =>
    models.Skill.belongsToMany(models.Employee, {
        through: 'employee_skill',
        as: 'employees',
        foreignKey: 'skillId'
    });

module.exports = {
    skillAssociations,
    skillDefinition
};