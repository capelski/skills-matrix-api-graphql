const employeesService = require('./employees-service');
const skillsService = require('./skills-service');

const contextFactory = (repositories) => ({
    employees: employeesService(repositories),
    skills: skillsService(repositories)
});

module.exports = contextFactory;