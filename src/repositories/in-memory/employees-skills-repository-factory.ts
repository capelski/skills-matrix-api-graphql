import {
    EmployeeSkill,
    EmployeeFilter,
    Repositories,
    SkillFilter,
    EmployeeOrderBy,
    SkillOrderBy,
    EmployeesSkillsRepository,
    Skill,
    Employee
} from '..';
import employeesSkillsData from './data/employees-skills.json';
import { sortByProperty } from './shared';

const matchingEmployeeSkill = (employeeId: number, skillId: number) => (e_s: EmployeeSkill) =>
    e_s.skillId === skillId && e_s.employeeId === employeeId;

export default (repositories: Repositories): EmployeesSkillsRepository => {
    const source: EmployeeSkill[] = [...employeesSkillsData];

    const add = ({ employeeId, skillId }: EmployeeSkill) => {
        return Promise.resolve(source).then(employees_skills => {
            let employee_skill = employees_skills.find(matchingEmployeeSkill(employeeId, skillId));
            if (!employee_skill) {
                employee_skill = {
                    employeeId,
                    skillId
                };
                employees_skills.push(employee_skill);
            }
            return employee_skill;
        });
    };

    const countByEmployeeId = (employeeId: number, filter?: EmployeeFilter) => {
        return Promise.resolve(source)
            .then(employees_skills => employees_skills.filter(e_s => e_s.employeeId === employeeId))
            .then(employeeSkills =>
                Promise.all(employeeSkills.map(se => repositories.skills.getById(se.skillId)))
            )
            .then(skills => {
                if (filter && filter.name) {
                    const nameFilter = filter.name.toLowerCase();
                    skills = skills.filter(s => s && s.name.toLowerCase().indexOf(nameFilter) > -1);
                }
                return skills.length;
            });
    };

    const countBySkillId = (skillId: number, filter?: SkillFilter) => {
        return Promise.resolve(source)
            .then(employees_skills => employees_skills.filter(e_s => e_s.skillId === skillId))
            .then(skillEmployees =>
                Promise.all(skillEmployees.map(se => repositories.employees.getById(se.employeeId)))
            )
            .then(employees => {
                if (filter && filter.name) {
                    const nameFilter = filter.name.toLowerCase();
                    employees = employees.filter(
                        e => e && e.name.toLowerCase().indexOf(nameFilter) > -1
                    );
                }
                return employees.length;
            });
    };

    const getByEmployeeId = (
        employeeId: number,
        skip = 0,
        first = 10,
        filter?: EmployeeFilter,
        orderBy?: EmployeeOrderBy
    ) => {
        return Promise.resolve(source)
            .then(employees_skills => employees_skills.filter(e_s => e_s.employeeId === employeeId))
            .then(employeeSkills =>
                Promise.all(employeeSkills.map(se => repositories.skills.getById(se.skillId)))
            )
            .then(skills => {
                if (filter && filter.name) {
                    const nameFilter = filter.name.toLowerCase();
                    return skills.filter(s => s && s.name.toLowerCase().indexOf(nameFilter) > -1);
                }
                return skills.filter(Boolean);
            })
            .then((filteredSkills: Skill[]) => {
                if (orderBy && orderBy.name) {
                    return filteredSkills.sort(sortByProperty('name', orderBy.name));
                }
                return filteredSkills.sort(sortByProperty('id', 1));
            })
            .then(filteredSkills => filteredSkills.slice(skip, skip + first));
    };

    const getBySkillId = (
        skillId: number,
        skip = 0,
        first = 10,
        filter?: SkillFilter,
        orderBy?: SkillOrderBy
    ) => {
        return Promise.resolve(source)
            .then(employees_skills => employees_skills.filter(e_s => e_s.skillId === skillId))
            .then(skillEmployees =>
                Promise.all(skillEmployees.map(se => repositories.employees.getById(se.employeeId)))
            )
            .then(employees => {
                if (filter && filter.name) {
                    const nameFilter = filter.name.toLowerCase();
                    return employees.filter(
                        e => e && e.name.toLowerCase().indexOf(nameFilter) > -1
                    );
                }
                return employees.filter(Boolean);
            })
            .then((filteredEmployees: Employee[]) => {
                if (orderBy && orderBy.name) {
                    return filteredEmployees.sort(sortByProperty('name', orderBy.name));
                }
                return filteredEmployees.sort(sortByProperty('id', 1));
            })
            .then(filteredEmployees => filteredEmployees.slice(skip, skip + first));
    };

    const remove = ({ employeeId, skillId }: EmployeeSkill): Promise<EmployeeSkill | undefined> => {
        return Promise.resolve(source).then(employees_skills => {
            const employeeSkillIndex = employees_skills.findIndex(
                matchingEmployeeSkill(employeeId, skillId)
            );
            if (employeeSkillIndex > -1) {
                return employees_skills.splice(employeeSkillIndex, 1)[0];
            }
        });
    };

    const removeByEmployeeId = (employeeId: number): Promise<EmployeeSkill[]> => {
        return Promise.resolve(source).then(employees_skills => {
            const relations = employees_skills.filter(e_s => e_s.employeeId === employeeId);
            return Promise.all(relations.map(remove)).then(
                employeesSkills => employeesSkills.filter(Boolean) as EmployeeSkill[]
            );
        });
    };

    const removeBySkillId = (skillId: number): Promise<EmployeeSkill[]> => {
        return Promise.resolve(source).then(employees_skills => {
            const relations = employees_skills.filter(e_s => e_s.skillId === skillId);
            return Promise.all(relations.map(remove)).then(
                employeesSkills => employeesSkills.filter(Boolean) as EmployeeSkill[]
            );
        });
    };

    return {
        add,
        countByEmployeeId,
        countBySkillId,
        getByEmployeeId,
        getBySkillId,
        removeByEmployeeId,
        removeBySkillId
    };
};
