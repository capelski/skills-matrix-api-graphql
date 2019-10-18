const employeesService = (repositories) => {
	// const create = employeeData => {
	// 	return repositories.employees.add(employeeData)
	// 	.then(employee => {
	// 		return Promise.all(
	// 			employeeData.skills.map(skillData =>
	// 				// TODO Take care of this operation inside the employees-skills-repository
	// 				employeesSkillsRepository.add({skillId: skillData.id, employeeId: employee.id})
	// 			)
	// 		)
	// 		.then(() => employee);
	// 	});
	// }

	// const deleteEmployee = id => {
	// 	return getById(id)
	// 	.then(employee => {
	// 		if (employee) {
	// 			return Promise.all([
	// 				repositories.employees.remove(id),
	// 				// TODO Take care of this operation inside the employees-skills-repository
	// 				employeesSkillsRepository.removeByEmployeeId(id)
	// 			])
	// 			.then(() => employee);
	// 		}
	// 		return undefined;
	// 	});
	// };

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

	// const update = employeeData => {
	// 	return getById(employeeData.id)
	// 	.then(employee => {
	// 		if (employee) {
	// 			// TODO Update this to call the repositories.employees.update
	// 			employee.name = employeeData.name;
	// 			// TODO Take care of these operations inside the employees-skills-repository
	// 			employeesSkillsRepository.removeByEmployeeId(employeeData.id);
	// 			employeeData.skills.forEach(skillData => {
	// 				employeesSkillsRepository.add({skillId: skillData.id, employeeId: employeeData.id})
	// 			});
	// 		}
	// 		return employee;
	// 	});
	// };

	return {
		// create,
		// deleteEmployee,
		getAll,
		getById,
		getEmployeeSkills,
		// update
	};
};

module.exports = employeesService;
