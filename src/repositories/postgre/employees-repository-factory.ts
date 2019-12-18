import { EmployeeFilter, EmployeeOrderBy, EmployeesRepository, SqlQueryResolver } from '../types';

export default (sqlQueryResolver: SqlQueryResolver): EmployeesRepository => {
    const add = (name: string) => {
        const insertQuery = `INSERT INTO employee(id, name) VALUES (nextval('employee_id_sequence'), $1)`;
        const insertParameters = [name];

        return sqlQueryResolver(insertQuery, insertParameters)
            .then(() => {
                const selectQuery = `SELECT employee.id, employee.name FROM employee WHERE employee.id = currval('employee_id_sequence')`;
                return sqlQueryResolver(selectQuery);
            })
            .then(result => result.rows[0]);
    };

    const countAll = (filter?: EmployeeFilter) => {
        let query = 'SELECT COUNT(*) FROM employee';
        const parameters = [];
        if (filter && filter.name) {
            query = query + ` WHERE lower(employee.name) LIKE $1`;
            parameters.push(`%${filter.name.toLowerCase()}%`);
        }
        return sqlQueryResolver(query, parameters).then(result => result.rows[0].count);
    };

    const getAll = (skip = 0, first = 10, filter?: EmployeeFilter, orderBy?: EmployeeOrderBy) => {
        let query = 'SELECT employee.id, employee.name FROM employee';
        const parameters = [];
        if (orderBy && orderBy.skills) {
            query = query + ` LEFT JOIN employee_skill ON employee.id = employee_skill.employee_id`;
        }
        if (filter && filter.name) {
            parameters.push(`%${filter.name.toLowerCase()}%`);
            query = query + ` WHERE lower(employee.name) LIKE $${parameters.length}`;
        }
        if (orderBy && (orderBy.name || orderBy.skills)) {
            if (orderBy.name) {
                query = query + ` ORDER BY employee.name ${orderBy.name > 0 ? 'ASC' : 'DESC'}`;
            }
            if (orderBy.skills) {
                query =
                    query +
                    ` GROUP BY employee.id, employee.name ORDER BY COUNT(employee_skill.skill_id) ${
                        orderBy.skills > 0 ? 'ASC' : 'DESC'
                    }, employee.name`;
            }
        } else {
            query = query + ` ORDER BY employee.id ASC`;
        }
        parameters.push(first, skip);
        query = query + ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;

        return sqlQueryResolver(query, parameters).then(result => result.rows);
    };

    const getById = (id: number) => {
        const query = `SELECT employee.id, employee.name FROM employee WHERE employee.id = $1`;
        return sqlQueryResolver(query, [id]).then(result => result.rows[0]);
    };

    const remove = (id: number) => {
        const selectQuery = `SELECT employee.id, employee.name FROM employee WHERE employee.id = $1`;
        const parameters = [id];

        return sqlQueryResolver(selectQuery, parameters).then(result => {
            const employee = result.rows[0];
            if (employee) {
                const deleteQuery = `DELETE FROM employee WHERE id = $1`;
                return sqlQueryResolver(deleteQuery, parameters).then(() => employee);
            }
        });
    };

    const update = (id: number, name: string) => {
        const updateQuery = 'UPDATE employee SET name = $1 WHERE id = $2';
        const updateParameters = [name, id];

        return sqlQueryResolver(updateQuery, updateParameters)
            .then(() => {
                const selectQuery =
                    'SELECT employee.id, employee.name FROM employee WHERE employee.id = $1';
                const selectParameters = [id];
                return sqlQueryResolver(selectQuery, selectParameters);
            })
            .then(result => result.rows[0]);
    };

    return {
        add,
        countAll,
        getAll,
        getById,
        remove,
        update
    };
};
