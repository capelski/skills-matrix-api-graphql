const employeesService = (models, dbConnection) => {

	const create = employeeData => {
		const skillsId = employeeData.Skills.map(x => x.Id);
		employeeData = {
			Id: employeeData.Id,
			Name: employeeData.Name,
		};
		return models.Employee.create(employeeData)
		.then(employee => employee.setSkills(skillsId).then(_ => employee));
	};

	const deleteEmployee = id => {
		return models.Employee.findById(id)
		.then(employee => employee.destroy());
	};

	const getAll = (filter, page, pageSize) => {
		page = page || 0;
		pageSize = pageSize || 10;
		const findOptions = {
			include: [{
				model: models.Skill,
				as: 'Skills'
			}],
			limit: pageSize,
      		offset: page * pageSize,
		};
		if (filter) {
			findOptions.where = {
				name: {
					$like: `%${filter}%`
				}
			};
		}

		return models.Employee.findAndCountAll(findOptions)
		.then(result => {
			const pagedList = {
				CurrentPage: page,
				Items: result.rows,
				TotalPages: Math.ceil(result.count / pageSize),
				TotalRecords: result.count
			};
			return pagedList;
		});
	};

	const getById = id => models.Employee.findById(id, {
		include: [{
			model: models.Skill,
			as: 'Skills'
		}]
	});

	const getMostSkilled = () => {
		const sqlQuery = `
			SELECT employee.Id, employee.Name, mostSkilled.count
			FROM employee
			LEFT JOIN
			(
				SELECT employeeId, COUNT(employeeId) as count
				FROM employee_skill
				GROUP BY employeeId
				ORDER BY COUNT(employeeId) DESC
			) as mostSkilled ON mostSkilled.employeeId = employee.id
			ORDER BY mostSkilled.count DESC
			LIMIT 5;
		`;
		return dbConnection.query(sqlQuery, { type: dbConnection.QueryTypes.SELECT})
		.then(rows => {
			rows.forEach(r => {
				r.Skills = {
					length: r.count || 0
				};
			});
			return rows;
		});
	};

	const update = employeeData => {
		const employeeFields = {
			Name: employeeData.Name
		};
		const updateOptions = {
			where: {
				Id: employeeData.Id
			}
		};
		const skillsId = employeeData.Skills.map(x => x.Id);

		return models.Employee.update(employeeFields, updateOptions)
			.then(affectedRows => models.Employee.findById(employeeData.Id))
			.then(employee => employee.setSkills(skillsId).then(_ => employee));
	};

	return {
		create,
		deleteEmployee,
		getAll,
		getById,
		getMostSkilled,
		update
	};
};

module.exports = employeesService;
