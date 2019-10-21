let employees_skills = require('./data/employees-skills.json');

const matchingEmployeeSkill = (skillId, employeeId) => e_s  => e_s.skillId === skillId && e_s.employeeId === employeeId;

// TODO Extract into commons
const sortByName = (criteria) => (a, b) => {
	if (a.name < b.name) return -criteria;
	if (a.name > b.name) return criteria;
	return 0;
};

const sortById = (a, b) => {
	if (a.id < b.id) return -1;
	if (a.id > b.id) return 1;
	return 0;
};

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
				if (filter && filter.name) {
					const nameFilter = filter.name.toLowerCase();
					skills = skills.filter(s => s.name.toLowerCase().indexOf(nameFilter) > -1);
				}
				return skills.length;
			});
	};

	const countBySkillId = (skillId, filter) => {
		return Promise.resolve(employees_skills.filter(e_s => e_s.skillId === skillId))
			.then(skillEmployees => Promise.all(skillEmployees.map(se => repositories.employees.getById(se.employeeId))))
			.then(employees => {
				if (filter && filter.name) {
					const nameFilter = filter.name.toLowerCase();
					employees = employees.filter(e => e.name.toLowerCase().indexOf(nameFilter) > -1);
				}
				return employees.length;
			});
	};

	const getByEmployeeId = (employeeId, skip = 0, first = 10, filter, orderBy) => {
		return Promise.resolve(employees_skills.filter(e_s => e_s.employeeId === employeeId))
			.then(employeeSkills => Promise.all(employeeSkills.map(se => repositories.skills.getById(se.skillId))))
			.then(skills => {
				if (filter && filter.name) {
					const nameFilter = filter.name.toLowerCase();
					skills = skills.filter(s => s.name.toLowerCase().indexOf(nameFilter) > -1);
				}
				return skills;
			})
			.then(filteredSkills => {
				if (orderBy && orderBy.name) {
					return filteredSkills.sort(sortByName(orderBy.name));
				}
				return filteredSkills.sort(sortById);
			})
			.then(filteredSkills => filteredSkills.slice(skip, skip + first));
	};

	const getBySkillId = (skillId, skip = 0, first = 10, filter, orderBy) => {
		return Promise.resolve(employees_skills.filter(e_s => e_s.skillId === skillId))
			.then(skillEmployees => Promise.all(skillEmployees.map(se => repositories.employees.getById(se.employeeId))))
			.then(employees => {
				if (filter && filter.name) {
					const nameFilter = filter.name.toLowerCase();
					employees = employees.filter(e => e.name.toLowerCase().indexOf(nameFilter) > -1);
				}
				return employees;
			})
			.then(filteredEmployees => {
				if (orderBy && orderBy.name) {
					return filteredEmployees.sort(sortByName(orderBy.name));
				}
				return filteredEmployees.sort(sortById);
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