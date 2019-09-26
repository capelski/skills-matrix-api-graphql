const employeesService = (employeesRepository) => {
	// const create = employeeData => {
	// 	return employeesRepository.add(employeeData)
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
	// 				employeesRepository.remove(id),
	// 				// TODO Take care of this operation inside the employees-skills-repository
	// 				employeesSkillsRepository.removeByEmployeeId(id)
	// 			])
	// 			.then(() => employee);
	// 		}
	// 		return undefined;
	// 	});
	// };

	const getAll = (filter, skip, first, orderBy) => {
		return employeesRepository.getAll(filter, skip, first, true, orderBy)
		.then(employees => {
			return employeesRepository.countAll(filter)
			.then(totalCount => ({
				items: employees,
				totalCount
			}));
		});
	};

	const getById = id => {
		return employeesRepository.getById(id, true);
	};

	// const update = employeeData => {
	// 	return getById(employeeData.id)
	// 	.then(employee => {
	// 		if (employee) {
	// 			// TODO Update this to call the employeesRepository.update
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
		// update
	};
};

module.exports = employeesService;
