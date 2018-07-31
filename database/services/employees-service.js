const employeesService = models => {

	// TODO Set the Skills
	const create = employeeData => models.Employee.create(employeeData);

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
				// TODO Compute the total rows number
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

	// TODO Implement
	const getMostSkilled = () => getAll().then(page => page.Items);

	// TODO Set the Skills
	const update = employeeData => {
		const employeeFields = {
			Name: employeeData.Name
		};
		const updateOptions = {
			where: {
				Id: employeeData.Id
			}
		};

		return models.Employee.update(employeeFields, updateOptions)
			.then(affectedRows => models.Employee.findById(employeeData.Id));
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
