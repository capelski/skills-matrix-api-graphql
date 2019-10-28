const employeesRepositoryFactory = (postgreClient, repositories) => {
	// const add = (name) => {
	// 	return Promise.resolve(source)
	// 		.then(employees => {
	// 			const employee = { id: nextEmployeeId++, name };
	// 			employees.push(employee);
	// 			return { ...employee };
	// 		});
	// };

	const countAll = (filter) => {
		let query = 'SELECT COUNT(*) FROM employee';
		const parameters = [];
		if (filter && filter.name) {
			query = query + ` WHERE lower(name) LIKE $1`;
			parameters.push(`%${filter.name.toLowerCase()}%`);
		}
		return postgreClient.query(query, parameters)
			.then(result => result.rows[0].count);
	};

	const getAll = (skip = 0, first = 10, filter, orderBy) => {
		let query = 'SELECT id, name FROM employee';
		const parameters = [];
		if (orderBy && orderBy.skills) {
			query = query + ` LEFT JOIN employee_skill ON id = employee_id`;
		}
		if (filter && filter.name) {
			parameters.push(`%${filter.name.toLowerCase()}%`);
			query = query + ` WHERE lower(name) LIKE $${parameters.length}`;
		}
		if (orderBy && (orderBy.name || orderBy.skills)) {
			if (orderBy.name) {
				query = query + ` ORDER BY name ${orderBy.name > 0 ? 'ASC' : 'DESC'}`;
			}
			if (orderBy.skills) {
				query = query + ` GROUP BY id, name ORDER BY COUNT(skill_id) ${orderBy.skills > 0 ? 'ASC' : 'DESC'}`;
			}
		}
		else {
			query = query + ` ORDER BY id ASC`;			
		}
		parameters.push(first, skip);
		query = query + ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;

		return postgreClient.query(query, parameters)
			.then(result => result.rows);
	};

	const getById = id => {
		let query = `SELECT id, name FROM employee WHERE id = $1`;
		return postgreClient.query(query, [id])
			.then(result => result.rows[0]);
	}
		
	// const remove = id => {
	// 	return Promise.resolve(source)
	// 		.then(employees => {
	// 			const employeeIndex = employees.findIndex(e => e.id === id);
	// 			if (employeeIndex > -1) {
	// 				return employees.splice(employeeIndex, 1)[0];
	// 			}
	// 		});
	// };

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
		// add,
		countAll,
		getAll,
		getById,
		// remove,
		// update
	};
};

module.exports = employeesRepositoryFactory;
