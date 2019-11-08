import { Client } from 'pg';
import {
    EmployeeFilter,
    SkillFilter,
    EmployeeOrderBy,
    EmployeeSkill,
    SkillOrderBy,
    EmployeesSkillsRepository
} from '..';

export default (postgreClient: Client): EmployeesSkillsRepository => {
    const add = ({ employeeId, skillId }: EmployeeSkill) => {
        const insertQuery = 'INSERT INTO employee_skill(employee_id, skill_id) VALUES ($1, $2)';
        const parameters = [employeeId, skillId];

        return postgreClient
            .query(insertQuery, parameters)
            .then(() => {
                const selectQuery =
                    'SELECT employee_id, skill_id FROM employee_skill WHERE employee_id = $1 AND skill_id = $2';
                return postgreClient.query(selectQuery, parameters);
            })
            .then(result => result.rows[0]);
    };

    const countByEmployeeId = (employeeId: number, filter?: EmployeeFilter) => {
        let query = `SELECT COUNT(*) FROM skill
		INNER JOIN employee_skill ON skill.id = employee_skill.skill_id
		WHERE employee_skill.employee_id = $1`;
        const parameters: (string | number)[] = [employeeId];
        if (filter && filter.name) {
            parameters.push(`%${filter.name.toLowerCase()}%`);
            query = query + ` AND lower(skill.name) LIKE $2`;
        }

        return postgreClient.query(query, parameters).then(result => result.rows[0].count);
    };

    const countBySkillId = (skillId: number, filter?: SkillFilter) => {
        let query = `SELECT COUNT(*) FROM employee
		INNER JOIN employee_skill ON employee.id = employee_skill.employee_id
		WHERE employee_skill.skill_id = $1`;
        const parameters: (string | number)[] = [skillId];
        if (filter && filter.name) {
            parameters.push(`%${filter.name.toLowerCase()}%`);
            query = query + ` AND lower(employee.name) LIKE $2`;
        }

        return postgreClient.query(query, parameters).then(result => result.rows[0].count);
    };

    const getByEmployeeId = (
        employeeId: number,
        skip = 0,
        first = 10,
        filter?: SkillFilter,
        orderBy?: SkillOrderBy
    ) => {
        let query = `SELECT skill.id, skill.name FROM skill
		INNER JOIN employee_skill ON skill.id = employee_skill.skill_id
		WHERE employee_skill.employee_id = $1`;
        const parameters: (string | number)[] = [employeeId];
        if (filter && filter.name) {
            parameters.push(`%${filter.name.toLowerCase()}%`);
            query = query + ` AND lower(skill.name) LIKE $${parameters.length}`;
        }
        if (orderBy && orderBy.name) {
            query = query + ` ORDER BY skill.name ${orderBy.name > 0 ? 'ASC' : 'DESC'}`;
        } else {
            query = query + ` ORDER BY skill.id ASC`;
        }
        parameters.push(first, skip);
        query = query + ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;

        return postgreClient.query(query, parameters).then(result => result.rows);
    };

    const getBySkillId = (
        skillId: number,
        skip = 0,
        first = 10,
        filter?: EmployeeFilter,
        orderBy?: EmployeeOrderBy
    ) => {
        let query = `SELECT employee.id, employee.name FROM employee
		INNER JOIN employee_skill ON employee.id = employee_skill.employee_id
		WHERE employee_skill.skill_id = $1`;
        const parameters: (string | number)[] = [skillId];
        if (filter && filter.name) {
            parameters.push(`%${filter.name.toLowerCase()}%`);
            query = query + ` AND lower(employee.name) LIKE $${parameters.length}`;
        }
        if (orderBy && orderBy.name) {
            query = query + ` ORDER BY employee.name ${orderBy.name > 0 ? 'ASC' : 'DESC'}`;
        } else {
            query = query + ` ORDER BY employee.id ASC`;
        }
        parameters.push(first, skip);
        query = query + ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;

        return postgreClient.query(query, parameters).then(result => result.rows);
    };

    const removeByEmployeeId = (employeeId: number) => {
        const selectQuery = `SELECT employee_skill.employee_id, employee_skill.skill_id FROM employee_skill WHERE employee_skill.employee_id = $1`;
        const parameters = [employeeId];

        return postgreClient.query(selectQuery, parameters).then(result => {
            const { rows } = result;
            if (rows.length > 0) {
                const deleteQuery = `DELETE FROM employee_skill WHERE employee_id = $1`;
                return postgreClient.query(deleteQuery, parameters).then(() => rows);
            }
            return rows;
        });
    };

    const removeBySkillId = (skillId: number) => {
        const selectQuery = `SELECT employee_skill.employee_id, employee_skill.skill_id FROM employee_skill WHERE employee_skill.skill_id = $1`;
        const parameters = [skillId];

        return postgreClient.query(selectQuery, parameters).then(result => {
            const { rows } = result;
            if (rows.length > 0) {
                const deleteQuery = `DELETE FROM employee_skill WHERE skill_id = $1`;
                return postgreClient.query(deleteQuery, parameters).then(() => rows);
            }
            return rows;
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
