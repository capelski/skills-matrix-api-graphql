const employeesRepositoryFactory = require('./employees-repository-factory');
const employeesSkillsRepositoryFactory = require('./employees-skills-repository-factory');
const skillsRepositoryFactory = require('./skills-repository-factory');

const getRepositories = (postgreClient) => {
    const repositories = {};

    // Instantiating repositories from the index to resolve cyclic dependencies.
    // This approach is possible because employeesRepositoryFactory doesn't access
    // repositories.skills before repositories.skills is defined and vice versa
    repositories.employees = employeesRepositoryFactory(postgreClient, repositories);
    repositories.employeesSkills = employeesSkillsRepositoryFactory(postgreClient, repositories);
    repositories.skills = skillsRepositoryFactory(postgreClient, repositories);

    return repositories;
}

module.exports = getRepositories;