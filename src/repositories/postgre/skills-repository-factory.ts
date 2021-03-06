import { SkillFilter, SkillOrderBy, SkillsRepository, SqlQueryResolver } from '../types';

export default (sqlQueryResolver: SqlQueryResolver): SkillsRepository => {
    const add = (name: string) => {
        const insertQuery = `INSERT INTO skill(id, name) VALUES (nextval('skill_id_sequence'), $1)`;
        const insertParameters = [name];

        return sqlQueryResolver(insertQuery, insertParameters)
            .then(() => {
                const selectQuery = `SELECT skill.id, skill.name FROM skill WHERE skill.id = currval('skill_id_sequence')`;
                return sqlQueryResolver(selectQuery);
            })
            .then(result => result.rows[0]);
    };

    const countAll = (filter?: SkillFilter) => {
        let query = 'SELECT COUNT(*) FROM skill';
        const parameters = [];
        if (filter && filter.name) {
            query = query + ` WHERE lower(skill.name) LIKE $1`;
            parameters.push(`%${filter.name.toLowerCase()}%`);
        }
        return sqlQueryResolver(query, parameters).then(result => result.rows[0].count);
    };

    const getAll = (skip = 0, first = 10, filter?: SkillFilter, orderBy?: SkillOrderBy) => {
        let query = 'SELECT skill.id, skill.name FROM skill';
        const parameters = [];
        if (orderBy && orderBy.employees) {
            query = query + ` LEFT JOIN employee_skill ON skill.id = employee_skill.skill_id`;
        }
        if (filter && filter.name) {
            parameters.push(`%${filter.name.toLowerCase()}%`);
            query = query + ` WHERE lower(skill.name) LIKE $${parameters.length}`;
        }
        if (orderBy && (orderBy.name || orderBy.employees)) {
            if (orderBy.name) {
                query = query + ` ORDER BY skill.name ${orderBy.name > 0 ? 'ASC' : 'DESC'}`;
            }
            if (orderBy.employees) {
                query =
                    query +
                    ` GROUP BY skill.id, skill.name ORDER BY COUNT(employee_skill.employee_id) ${
                        orderBy.employees > 0 ? 'ASC' : 'DESC'
                    }, skill.name`;
            }
        } else {
            query = query + ` ORDER BY skill.id ASC`;
        }
        parameters.push(first, skip);
        query = query + ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;

        return sqlQueryResolver(query, parameters).then(result => result.rows);
    };

    const getById = (id: number) => {
        const query = `SELECT skill.id, skill.name FROM skill WHERE skill.id = $1`;
        return sqlQueryResolver(query, [id]).then(result => result.rows[0]);
    };

    const getByIds = (ids: number[]) => {
        const query = `SELECT skill.id, skill.name FROM skill WHERE skill.id = ANY($1)`;
        return sqlQueryResolver(query, [ids]).then(result => result.rows);
    };

    const remove = (id: number) => {
        const selectQuery = `SELECT skill.id, skill.name FROM skill WHERE skill.id = $1`;
        const parameters = [id];

        return sqlQueryResolver(selectQuery, parameters).then(result => {
            const skill = result.rows[0];
            if (skill) {
                const deleteQuery = `DELETE FROM skill WHERE id = $1`;
                return sqlQueryResolver(deleteQuery, parameters).then(() => skill);
            }
        });
    };

    const update = (id: number, name: string) => {
        const updateQuery = 'UPDATE skill SET name = $1 WHERE id = $2';
        const updateParameters = [name, id];

        return sqlQueryResolver(updateQuery, updateParameters)
            .then(() => {
                const selectQuery = 'SELECT skill.id, skill.name FROM skill WHERE skill.id = $1';
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
        getByIds,
        remove,
        update
    };
};
