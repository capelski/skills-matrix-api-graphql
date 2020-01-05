import DataLoader from 'dataloader';
import { EmployeeFilter, EmployeeOrderBy, Repositories } from '../repositories/types';
import { dataLoaderMatcher } from './shared';
import { EmployeeCreateData, EmployeesResolver, EmployeeUpdateData } from './types';

const create = (repositories: Repositories) => (employeeData: EmployeeCreateData) => {
    return repositories.employees.add(employeeData.name).then(employee => {
        return Promise.all(
            employeeData.skillsId.map(skillId =>
                repositories.employeesSkills.add({ skillId, employeeId: employee.id })
            )
        ).then(() => employee);
    });
};

const getAll = (repositories: Repositories) => (
    skip = 0,
    first = 10,
    filter?: EmployeeFilter,
    orderBy?: EmployeeOrderBy
) => {
    return repositories.employees.getAll(skip, first, filter, orderBy).then(employees => {
        return repositories.employees.countAll(filter).then(totalCount => ({
            items: employees,
            totalCount
        }));
    });
};

const getById = (repositories: Repositories) => (id: number) => repositories.employees.getById(id);

const getEmployeeSkills = (repositories: Repositories) => (
    employeeId: number,
    skip = 0,
    first = 10,
    filter?: EmployeeFilter,
    orderBy?: EmployeeOrderBy
) => {
    return repositories.employeesSkills
        .getByEmployeeId(employeeId, skip, first, filter, orderBy)
        .then(skills => {
            return repositories.employeesSkills
                .countByEmployeeId(employeeId, filter)
                .then(totalCount => ({
                    items: skills,
                    totalCount
                }));
        });
};

const remove = (repositories: Repositories) => (id: number) => {
    return getById(repositories)(id).then(employee => {
        if (employee) {
            return repositories.employeesSkills
                .removeByEmployeeId(id)
                .then(() => repositories.employees.remove(id))
                .then(() => employee);
        }
        return undefined;
    });
};

const update = (repositories: Repositories) => (employeeData: EmployeeUpdateData) => {
    return getById(repositories)(employeeData.id)
        .then(employee => {
            if (employee && employeeData.name) {
                return repositories.employees.update(employee.id, employeeData.name);
            }
            return employee;
        })
        .then(employee => {
            if (employee && employeeData.skillsId) {
                return repositories.employeesSkills.removeByEmployeeId(employee.id).then(() => {
                    const promises = employeeData.skillsId.map(skillId =>
                        repositories.employeesSkills.add({ skillId, employeeId: employee.id })
                    );
                    return Promise.all(promises).then(() => employee);
                });
            }
            return employee;
        });
};

export const employeesResolver = (repositories: Repositories): EmployeesResolver => ({
    create: create(repositories),
    getAll: getAll(repositories),
    getById: getById(repositories),
    getEmployeeSkills: getEmployeeSkills(repositories),
    remove: remove(repositories),
    update: update(repositories)
});

const getByIds = (repositories: Repositories) => (ids: number[]) =>
    repositories.employees.getByIds(ids).then(dataLoaderMatcher(ids));

export const employeesDataLoaderResolver = (repositories: Repositories): EmployeesResolver => {
    const dataLoader = new DataLoader(getByIds(repositories));
    return {
        create: create(repositories),
        getAll: getAll(repositories),
        getById: (id: number) => dataLoader.load(id),
        getEmployeeSkills: getEmployeeSkills(repositories),
        remove: remove(repositories),
        update: update(repositories)
    };
};
