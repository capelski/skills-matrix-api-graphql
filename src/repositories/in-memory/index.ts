import { Repositories } from '..';
import employeesRepositoryFactory from './employees-repository-factory';
import employeesSkillsRepositoryFactory from './employees-skills-repository-factory';
import skillsRepositoryFactory from './skills-repository-factory';

export default (): Repositories => {
    const repositories = {} as Repositories;

    // Instantiating repositories from the index to resolve cyclic dependencies.
    // This approach is possible because employeesRepositoryFactory doesn't access
    // repositories.skills before repositories.skills is defined and vice versa
    repositories.employees = employeesRepositoryFactory(repositories);
    repositories.employeesSkills = employeesSkillsRepositoryFactory(repositories);
    repositories.skills = skillsRepositoryFactory(repositories);

    return repositories;
};
