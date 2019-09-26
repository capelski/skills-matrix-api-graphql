const skillsService = (skillsRepository) => {
	// const create = skillData => {
	// 	return skillsRepository.add(skillData)
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
	// 				skillsRepository.remove(id),
	// 				// TODO Take care of this operation inside the employees-skills-repository
	// 				employeesSkillsRepository.removeBySkillId(id)
	// 			])
	// 			.then(() => skill);
	// 		}
	// 		return undefined;
	// 	});
	// };

	const getAll = (filter, skip, first, orderBy) => {
		// TODO Include employees only if they are being requested
		return skillsRepository.getAll(filter, skip, first, true, orderBy)
		.then(skills => {
			return skillsRepository.countAll(filter)
			.then(totalCount => ({
				items: skills,
				totalCount
			}));
		});
	};

	const getById = id => {
		return skillsRepository.getById(id, true);
	};

	// const update = skillData => {
	// 	return getById(skillData.id)
	// 	.then(skill => {		
	// 		if (skill) {
	// 			// TODO Update this to call the skillsRepository.update
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
		// update
	};
};

module.exports = skillsService;
