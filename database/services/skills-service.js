const skillsService = models => {

	// TODO Set the Employees
	const create = skillData => models.Skill.create(skillData);

	const deleteSkill = id => {
		return models.Skill.findById(id)
		.then(skill => skill.destroy());
	};

	const getAll = (filter, page, pageSize) => {
		// TODO Implement filtering and pagination
		return models.Skill.findAll({
			include: [{
				model: models.Employee,
				as: 'Employees'
			}]
		})
		.then(skills => {
			const pagedList = {
				CurrentPage: page,
				Items: skills,
				TotalPages: Math.ceil(skills.length / pageSize),
				TotalRecords: skills.length
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
