const employeesRepositoryFactory = require('./employees-repository-factory');
const employeesSkillsRepository = require('./employees-skills-repository');
const skillsRepositoryFactory = require('./skills-repository-factory');

const repositories = {
    employeesSkills: employeesSkillsRepository,
};

// Instantiating repositories from the index to resolve cyclic dependencies
// This approach is possible because employeesRepositoryFactory doesn't access
// repositories.skills before repositories.skills is defined and vice versa
repositories.employees = employeesRepositoryFactory(repositories);
repositories.skills = skillsRepositoryFactory(repositories);

module.exports = repositories;