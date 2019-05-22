const skillsService = (models, dbConnection) => {

	const create = skillData => {
		const employeesId = skillData.Employees.map(x => x.Id);
		skillData = {
			Id: skillData.Id,
			Name: skillData.Name,
		};
		return models.Skill.create(skillData)
		.then(skill => skill.setEmployees(employeesId).then(_ => skill));
	};

	const deleteSkill = id => {
		return models.Skill.findById(id)
		.then(skill => skill.destroy());
	};

	const getAll = (filter, page, pageSize) => {
		page = page || 0;
		pageSize = pageSize || 10;
		const findOptions = {
			include: [{
				model: models.Employee,
				as: 'Employees'
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

		return models.Skill.findAndCountAll(findOptions)
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

	const getById = id => models.Skill.findById(id, {
		include: [{
			model: models.Employee,
			as: 'Employees'
		}]
	});

	const getRearest = () => {
		const sqlQuery = `
			SELECT skill.Id, skill.Name, rearest.count
			FROM skill
			LEFT JOIN
			(
				SELECT skillId, COUNT(skillId) as count
				FROM employee_skill
				GROUP BY skillId
				ORDER BY COUNT(skillId) ASC
			) as rearest ON rearest.skillId = skill.id
			ORDER BY rearest.count ASC
			LIMIT 5;
		`;
		return dbConnection.query(sqlQuery, { type: dbConnection.QueryTypes.SELECT})
		.then(rows => {
			rows.forEach(r => {
				r.Employees = {
					length: r.count || 0
				};
			});
			return rows;
		});
	};

	const update = skillData => {
		const skillFields = {
			Name: skillData.Name
		};
		const updateOptions = {
			where: {
				Id: skillData.Id
			}
		};
		const employeesId = skillData.Employees.map(x => x.Id);

		return models.Skill.update(skillFields, updateOptions)
			.then(affectedRows => models.Skill.findById(skillData.Id))
			.then(skill => skill.setEmployees(employeesId).then(_ => skill));
	};

	return {
		create,
		deleteSkill,
		getAll,
		getById,
		getRearest,
		update
	};
};

module.exports = skillsService;
