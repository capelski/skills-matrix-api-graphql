const employeesService = models => {

	const create = employee => {
		return models.Employee.create(employee);
	};

	const deleteEmployee = id => {
		return models.Employee.find(id)
		.then(employee => employee.destroy());
	};

	// return {
	// 	create,
	// 	deleteEmployee,
	// 	getAll,
	// 	getById,
	// 	getMostSkilled,
	// 	update
	// };
};

module.exports = employeesService;
