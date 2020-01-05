import employeesData from '../../../features/data/employees.json';
import {
    Employee,
    EmployeeFilter,
    EmployeeOrderBy,
    EmployeesRepository,
    Repositories
} from '../types';
import { filterItemsByName, sortByProperty } from './shared';

export default (repositories: Repositories): EmployeesRepository => {
    const source: Employee[] = employeesData.map((e: any) => ({ ...e }));
    let nextEmployeeId = source.length + 1;

    const add = (name: string) => {
        return Promise.resolve(source).then(employees => {
            const employee = { id: nextEmployeeId++, name };
            employees.push(employee);
            return { ...employee };
        });
    };

    const countAll = (filter?: EmployeeFilter) => {
        return Promise.resolve(source)
            .then(filterItemsByName(filter && filter.name))
            .then(filteredEmployees => filteredEmployees.length);
    };

    const getAll = (skip = 0, first = 10, filter?: EmployeeFilter, orderBy?: EmployeeOrderBy) => {
        return Promise.resolve(source)
            .then(filterItemsByName(filter && filter.name))
            .then(filteredEmployees => {
                if (orderBy) {
                    if (orderBy.name) {
                        return filteredEmployees.sort(sortByProperty('name', orderBy.name));
                    } else if (orderBy.skills) {
                        return Promise.all(filteredEmployees.map(loadEmployeeSkillsCount)).then(
                            extendedEmployees =>
                                extendedEmployees.sort(
                                    sortByProperty(
                                        'skillsCount',
                                        orderBy.skills!,
                                        sortByProperty('name', 1)
                                    )
                                )
                        );
                    }
                }
                return filteredEmployees;
            })
            .then(filteredEmployees => filteredEmployees.slice(skip, skip + first))
            .then(selectedEmployees => selectedEmployees.map(e => ({ ...e })));
    };

    const getById = (id: number) =>
        Promise.resolve(source)
            .then(employees => employees.find(e => e.id === id))
            .then(employee => {
                if (employee) {
                    return { ...employee };
                }
            });

    const getByIds = (ids: number[]) =>
        Promise.resolve(source).then(employees =>
            employees.filter(e => ids.indexOf(e.id) > -1).map(e => ({ ...e }))
        );

    const loadEmployeeSkillsCount = (
        employee: Employee
    ): Promise<Employee & { skillsCount: number }> =>
        repositories.employeesSkills.countByEmployeeId(employee.id).then(employeeSkillsCount => {
            return {
                ...employee,
                skillsCount: employeeSkillsCount
            };
        });

    const remove = (id: number) => {
        return Promise.resolve(source).then(employees => {
            const employeeIndex = employees.findIndex(e => e.id === id);
            if (employeeIndex > -1) {
                return employees.splice(employeeIndex, 1)[0];
            }
        });
    };

    const update = (id: number, name: string) => {
        return Promise.resolve(source)
            .then(employees => employees.find(e => e.id === id))
            .then(employee => {
                if (employee) {
                    employee.name = name;
                    return { ...employee };
                }
            });
    };

    return {
        add,
        countAll,
        getAll,
        getById,
        getByIds,
        remove,
        update
    };
};
