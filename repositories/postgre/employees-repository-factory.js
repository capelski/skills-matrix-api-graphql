const employeesRepositoryFactory = (postgreClient, repositories) => {
	const add = (name) => {
		const insertQuery = `INSERT INTO employee(id, name) VALUES (nextval('employee_id_sequence'), $1)`;
		const insertParameters = [name];
		
		return postgreClient.query(insertQuery, insertParameters)
			.then(() => {
				const selectQuery = `SELECT employee.id, employee.name FROM employee WHERE employee.id = currval('employee_id_sequence')`;
				return postgreClient.query(selectQuery);
			})
			.then(result => result.rows[0]);
	};

	const countAll = (filter) => {
		let query = 'SELECT COUNT(*) FROM employee';
		const parameters = [];
		if (filter && filter.name) {
			query = query + ` WHERE lower(employee.name) LIKE $1`;
			parameters.push(`%${filter.name.toLowerCase()}%`);
		}
		return postgreClient.query(query, parameters)
			.then(result => result.rows[0].count);
	};

	const getAll = (skip = 0, first = 10, filter, orderBy) => {
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
				query = query + ` GROUP BY employee.id, employee.name ORDER BY COUNT(employee_skill.skill_id) ${orderBy.skills > 0 ? 'ASC' : 'DESC'}, employee.name`;
			}
		}
		else {
			query = query + ` ORDER BY employee.id ASC`;			
		}
		parameters.push(first, skip);
		query = query + ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;

		return postgreClient.query(query, parameters)
			.then(result => result.rows);
	};

	const getById = id => {
		let query = `SELECT employee.id, employee.name FROM employee WHERE employee.id = $1`;
		return postgreClient.query(query, [id])
			.then(result => result.rows[0]);
	}
		
	const remove = (id) => {
		const selectQuery = `SELECT employee.id, employee.name FROM employee WHERE employee.id = $1`;
		const parameters = [id];
		
		return postgreClient.query(selectQuery, parameters)
			.then(result => {
				const employee = result.rows[0];
				if (employee) {
					const deleteQuery = `DELETE FROM employee WHERE id = $1`;
					return postgreClient.query(deleteQuery, parameters)
						.then(() => employee);
				}
			});
	};

	// const update = (id, name) => {
	// 	return Promise.resolve(source)
	// 		.then(employees => employees.find(e => e.id === id))
	// 		.then(employee => {
	// 			if (employee) {
	// 				employee.name = name;
	// 				return { ...employee };
	// 			}
	// 		});
	// };

	return {
		add,
		countAll,
		getAll,
		getById,
		remove,
		// update
	};
};

module.exports = employeesRepositoryFactory;
