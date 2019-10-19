const skillsService = (repositories) => {
	// const create = skillData => {
	// 	return repositories.skills.add(skillData)
	// 	.then(skill => {
	// 		return Promise.all(
	// 			skillData.employees.map(employeeData =>
	// 				// TODO Take care of this operation inside the employees-skills-repository
	// 				employeesSkillsRepository.add({skillId: skill.id, employeeId: employeeData.id})
	// 			)
	// 		)
	// 		.then(() => skill);
	// 	});
	// }

	// const deleteSkill = id => {
	// 	return getById(id)
	// 	.then(skill => {
	// 		if (skill) {
	// 			return Promise.all([
	// 				repositories.skills.remove(id),
	// 				// TODO Take care of this operation inside the employees-skills-repository
	// 				employeesSkillsRepository.removeBySkillId(id)
	// 			])
	// 			.then(() => skill);
	// 		}
	// 		return undefined;
	// 	});
	// };

	const getAll = (skip, first, filter, orderBy) => {
		return repositories.skills.getAll(skip, first, filter, orderBy)
		.then(skills => {
			return repositories.skills.countAll(filter)
			.then(totalCount => ({
				items: skills,
				totalCount
			}));
		});
	};

	const getById = id => {
		return repositories.skills.getById(id);
	};

	const getSkillEmployees = (skillId, filter, skip, first, orderBy) => {
		return repositories.employeesSkills.getBySkillId(skillId, skip, first, filter, orderBy)
			.then(employees => {
				return repositories.employeesSkills.countBySkillId(skillId, filter)
				.then(totalCount => ({
					items: employees,
					totalCount
				}));
			});
	};

	// const update = skillData => {
	// 	return getById(skillData.id)
	// 	.then(skill => {		
	// 		if (skill) {
	// 			// TODO Update this to call the repositories.skills.update
	// 			skill.name = skillData.name;
	// 			// TODO Take care of these operations inside the employees-skills-repository
	// 			employeesSkillsRepository.removeBySkillId(skillData.id);
	// 			skillData.employees.forEach(employeeData => {
	// 				employeesSkillsRepository.add({skillId: skillData.id, employeeId: employeeData.id})
	// 			});
	// 		}
	// 		return skill;
	// 	});
	// };

	return {
		// create,
		// deleteSkill,
		getAll,
		getById,
		getSkillEmployees,
		// update
	};
};

module.exports = skillsService;
