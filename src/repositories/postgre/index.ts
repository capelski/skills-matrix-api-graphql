import { Client } from 'pg';
import { Repositories } from '..';
import employeesRepositoryFactory from './employees-repository-factory';
import employeesSkillsRepositoryFactory from './employees-skills-repository-factory';
import skillsRepositoryFactory from './skills-repository-factory';

export default (postgreClient: Client): Repositories => ({
    employees: employeesRepositoryFactory(postgreClient),
    employeesSkills: employeesSkillsRepositoryFactory(postgreClient),
    skills: skillsRepositoryFactory(postgreClient)
});
