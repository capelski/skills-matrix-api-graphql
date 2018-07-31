const skillsService = models => {

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

	// TODO Implement
	const getRearest = () => getAll().then(page => page.Items);

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
