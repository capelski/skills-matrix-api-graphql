let employees_skills = require('./data/employees-skills.json');

const matchingEmployeeSkill = (skillId, employeeId) => e_s  => e_s.skillId === skillId && e_s.employeeId === employeeId;

const add = ({ employeeId, skillId }) => {
	const employee_skill = employees_skills.find(matchingEmployeeSkill(employeeId, skillId));
	if (!employee_skill) {
		employee_skill = {
			employeeId,
			skillId
		};
		employees_skills.push(employee_skill);
	}
	return Promise.resolve(employee_skill);
};

// TODO Provide filter, first, skip arguments (after Connection types implementations)
const getByEmployeeId = employeeId => Promise.resolve(employees_skills.filter(e_s => e_s.employeeId === employeeId));

// TODO Provide filter, first, skip arguments (after Connection types implementations)
const getBySkillId = skillId => Promise.resolve(employees_skills.filter(e_s => e_s.skillId === skillId));

const remove = ({ employeeId, skillId }) => {
	const employee_skill = employees_skills.find(matchingEmployeeSkill(employeeId, skillId));
	if (employee_skill) {
		employees_skills = employees_skills.filter(e_s => !matchingEmployeeSkill(employeeId, skillId)(e_s));
	}
	return Promise.resolve(employee_skill);
};

const removeByEmployeeId = employeeId => {
	employees_skills = employees_skills.filter(e_s => e_s.employeeId !== employeeId);
	return Promise.resolve();
};

const removeBySkillId = skillId => {
	employees_skills = employees_skills.filter(e_s => e_s.skillId !== skillId);
	return Promise.resolve();
};

module.exports = {
	add,
	getByEmployeeId,
	getBySkillId,
	remove,
	removeByEmployeeId,
	removeBySkillId
};
