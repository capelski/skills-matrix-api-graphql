const employeesRepositoryFactory = require('./employees-repository-factory');
const employeesSkillsRepositoryFactory = require('./employees-skills-repository-factory');
const skillsRepositoryFactory = require('./skills-repository-factory');

const getRepositories = postgreClient => ({
    employees: employeesRepositoryFactory(postgreClient),
    employeesSkills: employeesSkillsRepositoryFactory(postgreClient),
    skills: skillsRepositoryFactory(postgreClient)
});

module.exports = getRepositories;
