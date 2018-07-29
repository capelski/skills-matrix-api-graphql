const employeesService = models => {

	// TODO Set the Skills
	const create = employeeData => models.Employee.create(employeeData);

	const deleteEmployee = id => {
		return models.Employee.findById(id)
		.then(employee => employee.destroy());
	};

	const getAll = (filter, page, pageSize) => {
		// TODO Implement filtering and pagination
		return models.Employee.findAll({
			include: [{
				model: models.Skill,
				as: 'Skills'
			}]
		})
		.then(employees => {
			const pagedList = {
				CurrentPage: page,
				Items: employees,
				TotalPages: Math.ceil(employees.length / pageSize),
				TotalRecords: employees.length
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
