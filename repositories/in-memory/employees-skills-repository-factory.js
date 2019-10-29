const { sortByName } = require('./shared');
const matchingEmployeeSkill = (employeeId, skillId) => e_s  => e_s.skillId === skillId && e_s.employeeId === employeeId;

const sortById = (a, b) => {
	if (a.id < b.id) return -1;
	if (a.id > b.id) return 1;
	return 0;
};

const employeesSkillsRepositoryFactory = (repositories) => {
	const source = [...require('./data/employees-skills.json')];

	const add = ({ employeeId, skillId }) => {
		return Promise.resolve(source)
			.then(employees_skills => {
				let employee_skill = employees_skills.find(matchingEmployeeSkill(employeeId, skillId));
				if (!employee_skill) {
					employee_skill = {
						employeeId,
						skillId
					};
					employees_skills.push(employee_skill);
				}
				return employee_skill;
			});
	};

	const countByEmployeeId = (employeeId, filter) => {
		return Promise.resolve(source)
			.then(employees_skills => employees_skills.filter(e_s => e_s.employeeId === employeeId))
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
		return Promise.resolve(source)
			.then(employees_skills => employees_skills.filter(e_s => e_s.skillId === skillId))
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
		return Promise.resolve(source)
			.then(employees_skills => employees_skills.filter(e_s => e_s.employeeId === employeeId))
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
		return Promise.resolve(source)
			.then(employees_skills => employees_skills.filter(e_s => e_s.skillId === skillId))
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
		return Promise.resolve(source)
			.then(employees_skills => {
				const employeeSkillIndex = employees_skills.findIndex(matchingEmployeeSkill(employeeId, skillId));
				if (employeeSkillIndex > -1) {
					return employees_skills.splice(employeeSkillIndex, 1)[0];
				}
			});
	};

	const removeByEmployeeId = employeeId => {
		return Promise.resolve(source)
			.then(employees_skills => {
				const relations = employees_skills.filter(e_s => e_s.employeeId === employeeId);
				return Promise.all(relations.map(remove));
			});
	};

	const removeBySkillId = skillId => {
		return Promise.resolve(source)
			.then(employees_skills => {
				const relations = employees_skills.filter(e_s => e_s.skillId === skillId);
				return Promise.all(relations.map(remove));
			});
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