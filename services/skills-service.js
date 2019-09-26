// const employeesSkillsRepository = require('../repositories/in-memory/employees-skills-repository');
const skillsRepository = require('../repositories/in-memory/skills-repository');

// const create = skillData => {
// 	return skillsRepository.add(skillData)
// 	.then(skill => {
// 		return Promise.all(
// 			skillData.employees.map(employeeData =>
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
// 				employeesSkillsRepository.removeBySkillId(id)
// 			])
// 			.then(() => skill);
// 		}
// 		return undefined;
// 	});
// };

const getAll = (filter, skip, first, orderBy) => {
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
// 			employeesSkillsRepository.removeBySkillId(skillData.id);
// 			skillData.employees.forEach(employeeData => {
// 				employeesSkillsRepository.add({skillId: skillData.id, employeeId: employeeData.id})
// 			});
// 		}
// 		return skill;
// 	});
// };

module.exports = {
	// create,
	// deleteSkill,
	getAll,
	getById,
	// update
};
