const skillsService = (models, dbConnection) => {

	// TODO Set the Employees
	const create = skillData => models.Skill.create(skillData);

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
			INNER JOIN
			(
				SELECT skillId, COUNT(skillId) as count
				FROM employee_skill
				GROUP BY skillId
				ORDER BY COUNT(skillId) ASC
				LIMIT 5
			) as rearest ON rearest.skillId = skill.id
			ORDER BY rearest.count ASC;
		`;
		return dbConnection.query(sqlQuery, { type: dbConnection.QueryTypes.SELECT})
		.then(rows => {
			rows.forEach(r => {
				r.Employees = {
					length: r.count
				};
			});
			return rows;
		});
	};

	// TODO Set the Employees
	const update = skillData => {
		const skillFields = {
			Name: skillData.Name
		};
		const updateOptions = {
			where: {
				Id: skillData.Id
			}
		};

		return models.Skill.update(skillFields, updateOptions)
			.then(affectedRows => models.Skill.findById(skillData.Id));
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
