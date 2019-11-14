import { Repositories } from '../types';
import employeesRepositoryFactory from './employees-repository-factory';
import employeesSkillsRepositoryFactory from './employees-skills-repository-factory';
import skillsRepositoryFactory from './skills-repository-factory';

export default (): Repositories => {
    const repositories: Partial<Repositories> = {};

    // Instantiating repositories from the index to resolve cyclic dependencies.
    // This approach is possible because employeesRepositoryFactory doesn't access
    // repositories.skills before repositories.skills is defined and vice versa
    repositories.employees = employeesRepositoryFactory(repositories as Repositories);
    repositories.employeesSkills = employeesSkillsRepositoryFactory(repositories as Repositories);
    repositories.skills = skillsRepositoryFactory(repositories as Repositories);

    return repositories as Repositories;
};
