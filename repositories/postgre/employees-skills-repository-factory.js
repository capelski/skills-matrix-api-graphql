const employeesSkillsRepositoryFactory = (postgreClient, repositories) => {
	// const add = ({ employeeId, skillId }) => {
	// 	return Promise.resolve(source)
	// 		.then(employees_skills => {
	// 			let employee_skill = employees_skills.find(matchingEmployeeSkill(employeeId, skillId));
	// 			if (!employee_skill) {
	// 				employee_skill = {
	// 					employeeId,
	// 					skillId
	// 				};
	// 				employees_skills.push(employee_skill);
	// 			}
	// 			return employee_skill;
	// 		});
	// };

	const countByEmployeeId = (employeeId, filter) => {
		let query = `SELECT COUNT(*) FROM skill
		INNER JOIN employee_skill ON id = skill_id
		WHERE employee_id = $1`;
		const parameters = [employeeId];
		if (filter && filter.name) {
			parameters.push(`%${filter.name.toLowerCase()}%`);
			query = query + ` AND lower(name) LIKE $2`;
		}

		return postgreClient.query(query, parameters)
			.then(result => result.rows[0].count);
	};

	const countBySkillId = (skillId, filter) => {
		let query = `SELECT COUNT(*) FROM employee
		INNER JOIN employee_skill ON id = employee_id
		WHERE skill_id = $1`;
		const parameters = [skillId];
		if (filter && filter.name) {
			parameters.push(`%${filter.name.toLowerCase()}%`);
			query = query + ` AND lower(name) LIKE $2`;
		}

		return postgreClient.query(query, parameters)
			.then(result => result.rows[0].count);
	};

	const getByEmployeeId = (employeeId, skip = 0, first = 10, filter, orderBy) => {
		let query = `SELECT id, name FROM skill
		INNER JOIN employee_skill ON id = skill_id
		WHERE employee_id = $1`;
		const parameters = [employeeId];
		if (filter && filter.name) {
			parameters.push(`%${filter.name.toLowerCase()}%`);
			query = query + ` AND lower(name) LIKE $${parameters.length}`;
		}
		if (orderBy && orderBy.name) {
			query = query + ` ORDER BY name ${orderBy.name > 0 ? 'ASC' : 'DESC'}`;
		}
		else {
			query = query + ` ORDER BY id ASC`;			
		}
		parameters.push(first, skip);
		query = query + ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;

		return postgreClient.query(query, parameters)
			.then(result => result.rows);
	};

	const getBySkillId = (skillId, skip = 0, first = 10, filter, orderBy) => {
		let query = `SELECT id, name FROM employee
		INNER JOIN employee_skill ON id = employee_id
		WHERE skill_id = $1`;
		const parameters = [skillId];
		if (filter && filter.name) {
			parameters.push(`%${filter.name.toLowerCase()}%`);
			query = query + ` AND lower(name) LIKE $${parameters.length}`;
		}
		if (orderBy && orderBy.name) {
			query = query + ` ORDER BY name ${orderBy.name > 0 ? 'ASC' : 'DESC'}`;
		}
		else {
			query = query + ` ORDER BY id ASC`;			
		}
		parameters.push(first, skip);
		query = query + ` LIMIT $${parameters.length - 1} OFFSET $${parameters.length}`;

		return postgreClient.query(query, parameters)
			.then(result => result.rows);
	};

	// const remove = ({ employeeId, skillId }) => {
	// 	return Promise.resolve(source)
	// 		.then(employees_skills => {
	// 			const employeeSkillIndex = employees_skills.findIndex(matchingEmployeeSkill(employeeId, skillId));
	// 			if (employeeSkillIndex > -1) {
	// 				return employees_skills.splice(employeeSkillIndex, 1)[0];
	// 			}
	// 		});
	// };

	// const removeByEmployeeId = employeeId => {
	// 	return Promise.resolve(source)
	// 		.then(employees_skills => {
	// 			const relations = employees_skills.filter(e_s => e_s.employeeId === employeeId);
	// 			return Promise.all(relations.map(remove));
	// 		});
	// };

	// const removeBySkillId = skillId => {
	// 	return Promise.resolve(source)
	// 		.then(employees_skills => {
	// 			const relations = employees_skills.filter(e_s => e_s.skillId === skillId);
	// 			return Promise.all(relations.map(remove));
	// 		});
	// };

	return {
		// add,
		countByEmployeeId,
		countBySkillId,
		getByEmployeeId,
		getBySkillId,
		// remove,
		// removeByEmployeeId,
		// removeBySkillId
	};
};

module.exports = employeesSkillsRepositoryFactory;