let employees = require('./data/employees.json');
// let nextEmployeeId = employees.length + 1;

const employeesRepositoryFactory = (repositories) => {
	// const add = ({ name }) => {
	// 	const employee = { id: nextEmployeeId++, name };
	// 	employees.push(employee);
	// 	return Promise.resolve(employee);
	// };

	const countAll = (filter) => {
		return Promise.resolve(employees)
			.then(filterEmployees(filter))
			.then(filteredEmployees => filteredEmployees.length);
	};

	const filterEmployees = (filter) => (employees) => {
		if (filter && filter.name) {
			const nameFilter = filter.name.toLowerCase();
			employees = employees.filter(e => e.name.toLowerCase().indexOf(nameFilter) > -1);
		}
		return Promise.resolve(employees);
	};

	const getAll = (skip = 0, first = 10, filter, orderBy) => {
		return Promise.resolve([...employees])
		.then(filterEmployees(filter))
		.then(filteredEmployees => {
			if (orderBy) {
				if (orderBy.name) {
					return filteredEmployees.sort(sortByName(orderBy.name));
				} else if (orderBy.skills) {
					return Promise.all(filteredEmployees.map(loadEmployeeSkillsCount))
						.then(filteredEmployees => filteredEmployees.sort(sortBySkillsLength(orderBy.skills)));
				}
			}
			return filteredEmployees;
		})
		.then(filteredEmployees => filteredEmployees.slice(skip, skip + first));
	};

	const getById = id => Promise.resolve(employees.find(e => e.id === id));

	const loadEmployeeSkillsCount = employee => repositories.employeesSkills.countByEmployeeId(employee.id)
		.then(employeeSkillsCount => {
			employee.skillsCount = employeeSkillsCount;
			return employee;
		});

	const sortBySkillsLength = (criteria) => (a, b) => {
		if (a.skillsCount < b.skillsCount) return -criteria;
		if (a.skillsCount > b.skillsCount) return criteria;
		return sortByName(1)(a, b);
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

	return {
		// add,
		countAll,
		getAll,
		getById
		// remove,
		// update
	};
};

module.exports = employeesRepositoryFactory;
