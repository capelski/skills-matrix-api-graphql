const employeesService = (repositories) => {
	const create = employeeData => {
		return repositories.employees.add(employeeData.name)
		.then(employee => {
			return Promise.all(
				employeeData.skillsId.map(skillId =>
					repositories.employeesSkills.add({skillId: skillId, employeeId: employee.id})
				)
			)
			.then(() => employee);
		});
	}

	const getAll = (skip, first, filter, orderBy) => {
		return repositories.employees.getAll(skip, first, filter, orderBy)
		.then(employees => {
			return repositories.employees.countAll(filter)
			.then(totalCount => ({
				items: employees,
				totalCount
			}));
		});
	};

	const getById = id => {
		return repositories.employees.getById(id);
	};

	const getEmployeeSkills = (employeeId, filter, skip, first, orderBy) => {
		return repositories.employeesSkills.getByEmployeeId(employeeId, skip, first, filter, orderBy)
			.then(skills => {
				return repositories.employeesSkills.countByEmployeeId(employeeId, filter)
					.then(totalCount => ({
						items: skills,
						totalCount
					}))
			});
	};

	const remove = id => {
		return getById(id)
		.then(employee => {
			if (employee) {
				return Promise.all([
					repositories.employees.remove(id),
					repositories.employeesSkills.removeByEmployeeId(id)
				])
				.then(() => employee);
			}
			return undefined;
		});
	};

	// const update = employeeData => {
	// 	return getById(employeeData.id)
	// 	.then(employee => {
	// 		if (employee) {
	// 			// TODO Update this to call the repositories.employees.update
	// 			employee.name = employeeData.name;
	// 			repositories.employeesSkills.removeByEmployeeId(employeeData.id);
	// 			employeeData.skills.forEach(skillData => {
	// 				repositories.employeesSkills.add({skillId: skillData.id, employeeId: employeeData.id})
	// 			});
	// 		}
	// 		return employee;
	// 	});
	// };

	return {
		create,
		getAll,
		getById,
		getEmployeeSkills,
		remove,
		// update
	};
};

module.exports = employeesService;
