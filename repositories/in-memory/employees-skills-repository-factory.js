let employees_skills = require('./data/employees-skills.json');

// TODO All operations should return a copy of the object to reflect the database nature

const matchingEmployeeSkill = (skillId, employeeId) => e_s  => e_s.skillId === skillId && e_s.employeeId === employeeId;

const employeesSkillsRepositoryFactory = (repositories) => {
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

	const countByEmployeeId = (employeeId, filter) => {
		return Promise.resolve(employees_skills.filter(e_s => e_s.employeeId === employeeId))
			.then(employeeSkills => Promise.all(employeeSkills.map(se => repositories.skills.getById(se.skillId))))
			.then(skills => {
				// TODO Filter
				return skills.length;
			});
	};

	const countBySkillId = (skillId, filter) => {
		return Promise.resolve(employees_skills.filter(e_s => e_s.skillId === skillId))
			.then(skillEmployees => Promise.all(skillEmployees.map(se => repositories.employees.getById(se.employeeId))))
			.then(employees => {
				// TODO Filter
				return employees.length;
			});
	};

	const getByEmployeeId = (employeeId, skip = 0, first = 10, filter, orderBy) => {
		// TODO Use the filter, skip, first and orderBy parameters
		return Promise.resolve(employees_skills.filter(e_s => e_s.employeeId === employeeId))
			.then(employeeSkills => Promise.all(employeeSkills.map(se => repositories.skills.getById(se.skillId))))
			.then(skills => {
				// TODO Filter
				return skills;
			})
			.then(filteredSkills => {
				// TODO Sort by Id
				if (orderBy && orderBy.name) {
					return filteredSkills.sort(sortByName(orderBy.name));
				}
				return filteredSkills;
			})
			.then(filteredSkills => filteredSkills.slice(skip, skip + first));
	};

	const getBySkillId = (skillId, skip = 0, first = 10, filter, orderBy) => {
		// TODO Use the filter, skip, first and orderBy parameters
		return Promise.resolve(employees_skills.filter(e_s => e_s.skillId === skillId))
			.then(skillEmployees => Promise.all(skillEmployees.map(se => repositories.employees.getById(se.employeeId))))
			.then(employees => {
				// TODO Filter
				return employees;
			})
			.then(filteredEmployees => {
				// TODO Sort by Id
				if (orderBy && orderBy.name) {
					return filteredEmployees.sort(sortByName(orderBy.name));
				}
				return filteredEmployees;
			})
			.then(filteredEmployees => filteredEmployees.slice(skip, skip + first));
	};

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

	return {
		add,
		countByEmployeeId,
		countBySkillId,
		getByEmployeeId,
		getBySkillId,
		remove,
		removeByEmployeeId,
		removeBySkillId
	};
};

module.exports = employeesSkillsRepositoryFactory;