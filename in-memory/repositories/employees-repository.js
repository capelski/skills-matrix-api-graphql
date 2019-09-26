let employees = require('../data/employees.json');
const employeesSkillsRepository = require('./employees-skills-repository');
// let nextEmployeeId = employees.length + 1;

// TODO All operations should return a copy of the object to reflect the database nature

// const add = ({ name }) => {
// 	const employee = { id: nextEmployeeId++, name };
// 	employees.push(employee);
// 	return Promise.resolve(employee);
// };

const countAll = (filter) => {
	return Promise.resolve(employees)
		.then(selectedEmployees => {
			if (filter && filter.name) {
				const nameFilter = filter.name.toLowerCase();
				selectedEmployees = selectedEmployees.filter(e => e.name.toLowerCase().indexOf(nameFilter) > -1);
			}
			return selectedEmployees.length;
		});
};

const getAll = (filter, skip = 0, first = 10, includeSkills = false, orderBy) => {
	return Promise.resolve([...employees])
	.then(selectedEmployees => {
		// TODO Extract filtering operation into common
		if (filter && filter.name) {
			const nameFilter = filter.name.toLowerCase();
			selectedEmployees = selectedEmployees.filter(e => e.name.toLowerCase().indexOf(nameFilter) > -1);
		}

		if (orderBy) {
			if (orderBy.name) {
				selectedEmployees.sort(sortByName(orderBy.name));
			} else if (orderBy.skills) {
				return Promise.all(selectedEmployees.map(loadEmployeeSkills))
					.then(selectedEmployees => selectedEmployees.sort(sortBySkillsLength(orderBy.name)));
			}
		}

		if (includeSkills) {
			selectedEmployees = selectedEmployees.map(loadEmployeeSkills);
		}

		return selectedEmployees;
	})
	.then(selectedEmployees => {
		selectedEmployees = selectedEmployees.slice(skip, skip + first);
		return Promise.resolve(selectedEmployees);
	});
};

const getById = (id, includeSkills) => Promise.resolve(employees.find(e => e.id === id))
	.then(employee => includeSkills ? loadEmployeeSkills(employee) : employee);

const loadEmployeeSkills = employee => employeesSkillsRepository.getByEmployeeId(employee.id)
	.then(employeeSkills => {
		// TODO Resolve the cyclic dependencies problem
		const skillsRepository = require('./skills-repository');
		return Promise.all(employeeSkills.map(se => skillsRepository.getById(se.skillId)))
	})
	.then(skills => {
		employee.skills = skills;
		return employee;
	});

const sortBySkillsLength = (criteria) => (a, b) => {
	if (a.skills.length < b.skills.length) return -criteria;
	if (a.skills.length > b.skills.length) return criteria;
	return 0;
};

const sortByName = (criteria) => (a, b) => {
	if (a.name < b.name) return -criteria;
	if (a.name > b.name) return criteria;
	return 0;
};
	
// const remove = id => {
// 	employees = employees.filter(e => e.id !== id);
// 	return Promise.resolve();
// };

// const update = employeeData => {
// 	const employee = getById(employeeData.id);
// 	if (employee) {
// 		employee.name = employeeData.name;
// 	}
// 	return Promise.resolve(employee);
// };

module.exports = {
	// add,
	countAll,
	getAll,
	getById,
	// remove,
	// update
};
