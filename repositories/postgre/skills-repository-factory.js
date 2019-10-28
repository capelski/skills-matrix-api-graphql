const skillsRepositoryFactory = (postgreClient, repositories) => {	
	// const add = (name) => {
	// 	return Promise.resolve(source)
	// 		.then(skills => {
	// 			const skill = { id: nextSkillId++, name };
	// 			skills.push(skill);
	// 			return { ...skill };
	// 		});
	// };

	const countAll = (filter) => {
		let query = 'SELECT COUNT(*) FROM skill';
		const parameters = [];
		if (filter && filter.name) {
			query = query + ` WHERE lower(name) LIKE $1`;
			parameters.push(`%${filter.name.toLowerCase()}%`);
		}
		return postgreClient.query(query, parameters)
			.then(result => result.rows[0].count);
	};

	const getAll = (skip = 0, first = 10, filter, orderBy) => {
		let query = 'SELECT id, name FROM skill';
		const parameters = [];
		if (orderBy && orderBy.employees) {
			query = query + ` LEFT JOIN employee_skill ON id = skill_id`;
		}
		if (filter && filter.name) {
			parameters.push(`%${filter.name.toLowerCase()}%`);
			query = query + ` WHERE lower(name) LIKE $${parameters.length}`;
		}
		if (orderBy && (orderBy.name || orderBy.employees)) {
			if (orderBy.name) {
				query = query + ` ORDER BY name ${orderBy.name > 0 ? 'ASC' : 'DESC'}`;
			}
			if (orderBy.employees) {
				query = query + ` GROUP BY id, name ORDER BY COUNT(employee_id) ${orderBy.employees > 0 ? 'ASC' : 'DESC'}`;
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
		let query = `SELECT id, name FROM skill WHERE id = $1`;
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
		// add,
		countAll,
		getAll,
		getById,
		// remove,
		// update
	};
};

module.exports = skillsRepositoryFactory;
