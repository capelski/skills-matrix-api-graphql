const { employeeDefinition, employeeAssociations } = require('./employee');
const { skillDefinition, skillAssociations } = require('./skill');

module.exports = (dbConnection, Sequelize) => {
    const models = {
        Employee: employeeDefinition(dbConnection, Sequelize),
        Skill: skillDefinition(dbConnection, Sequelize)
    };

    employeeAssociations(models);
    skillAssociations(models);

    return models;
};