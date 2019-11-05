const employeesRepositoryFactory = require('./employees-repository-factory');
const employeesSkillsRepositoryFactory = require('./employees-skills-repository-factory');
const skillsRepositoryFactory = require('./skills-repository-factory');

const getRepositories = () => {
    const repositories = {};

    // Instantiating repositories from the index to resolve cyclic dependencies.
    // This approach is possible because employeesRepositoryFactory doesn't access
    // repositories.skills before repositories.skills is defined and vice versa
    repositories.employees = employeesRepositoryFactory(repositories);
    repositories.employeesSkills = employeesSkillsRepositoryFactory(repositories);
    repositories.skills = skillsRepositoryFactory(repositories);

    return repositories;
};

module.exports = getRepositories;
