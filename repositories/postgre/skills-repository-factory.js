// TODO Remove repositories dependency
const skillsRepositoryFactory = (postgreClient, repositories) => {	
	const add = (name) => {
		const insertQuery = `INSERT INTO skill(id, name) VALUES (nextval('skill_id_sequence'), $1)`;
		const insertParameters = [name];
		
		return postgreClient.query(insertQuery, insertParameters)
			.then(() => {
				const selectQuery = `SELECT skill.id, skill.name FROM skill WHERE skill.id = currval('skill_id_sequence')`;
				return postgreClient.query(selectQuery);
			})
			.then(result => result.rows[0]);
	};

	const countAll = (filter) => {
		let query = 'SELECT COUNT(*) FROM skill';
		const parameters = [];
		if (filter && filter.name) {
			query = query + ` WHERE lower(skill.name) LIKE $1`;
			parameters.push(`%${filter.name.toLowerCase()}%`);
		}
		return postgreClient.query(query, parameters)
			.then(result => result.rows[0].count);
	};

	const getAll = (skip = 0, first = 10, filter, orderBy) => {
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
				query = query + ` GROUP BY skill.id, skill.name ORDER BY COUNT(employee_skill.employee_id) ${orderBy.employees > 0 ? 'ASC' : 'DESC'}, skill.name`;
			}
		}
		else {
			query = query + ` ORDER BY skill.id ASC`;			
		}
		parameters.push(first, skip);
		query = query + ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;

		return postgreClient.query(query, parameters)
			.then(result => result.rows);
	};

	const getById = id => {
		let query = `SELECT skill.id, skill.name FROM skill WHERE skill.id = $1`;
		return postgreClient.query(query, [id])
			.then(result => result.rows[0]);
	}

	// const remove = id => {
	// 	return Promise.resolve(source)
	// 		.then(skills => {
	// 			const skillIndex = skills.findIndex(e => e.id === id);
	// 			if (skillIndex > -1) {
	// 				return skills.splice(skillIndex, 1)[0];
	// 			}
	// 		});
	// };

	// const update = (id, name) => {
	// 	return Promise.resolve(source)
	// 		.then(skills => skills.find(s => s.id === id))
	// 		.then(skill => {
	// 			if (skill) {
	// 				skill.name = name;
	// 				return { ...skill };
	// 			}
	// 		});
	// };

	return {
		add,
		countAll,
		getAll,
		getById,
		// remove,
		// update
	};
};

module.exports = skillsRepositoryFactory;
