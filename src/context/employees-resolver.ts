import { EmployeeFilter, EmployeeOrderBy, Repositories } from '../repositories/types';
import { EmployeeCreateData, EmployeesResolver, EmployeeUpdateData } from './types';

export default (repositories: Repositories): EmployeesResolver => {
    const create = (employeeData: EmployeeCreateData) => {
        return repositories.employees.add(employeeData.name).then(employee => {
            return Promise.all(
                employeeData.skillsId.map(skillId =>
                    repositories.employeesSkills.add({ skillId, employeeId: employee.id })
                )
            ).then(() => employee);
        });
    };

    const getAll = (skip = 0, first = 10, filter?: EmployeeFilter, orderBy?: EmployeeOrderBy) => {
        return repositories.employees.getAll(skip, first, filter, orderBy).then(employees => {
            return repositories.employees.countAll(filter).then(totalCount => ({
                items: employees,
                totalCount
            }));
        });
    };

    const getById = (id: number) => repositories.employees.getById(id);

    const getEmployeeSkills = (
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

    const remove = (id: number) => {
        return getById(id).then(employee => {
            if (employee) {
                return repositories.employeesSkills
                    .removeByEmployeeId(id)
                    .then(() => repositories.employees.remove(id))
                    .then(() => employee);
            }
            return undefined;
        });
    };

    const update = (employeeData: EmployeeUpdateData) => {
        return getById(employeeData.id)
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

    return {
        create,
        getAll,
        getById,
        getEmployeeSkills,
        remove,
        update
    };
};
