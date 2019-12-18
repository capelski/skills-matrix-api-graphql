import { SqlRepositoriesBuilders } from '../types';
import employeesRepositoryFactory from './employees-repository-factory';
import employeesSkillsRepositoryFactory from './employees-skills-repository-factory';
import skillsRepositoryFactory from './skills-repository-factory';

export default (): SqlRepositoriesBuilders => ({
    employees: employeesRepositoryFactory,
    employeesSkills: employeesSkillsRepositoryFactory,
    skills: skillsRepositoryFactory
});
