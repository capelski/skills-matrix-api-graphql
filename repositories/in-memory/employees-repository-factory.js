const { filterItemsByName, sortByProperty } = require('./shared');

const employeesRepositoryFactory = (repositories) => {
	const source = require('./data/employees.json').map(e => ({...e}));
	let nextEmployeeId = source.length + 1;
	
	const add = (name) => {
		return Promise.resolve(source)
			.then(employees => {
				const employee = { id: nextEmployeeId++, name };
				employees.push(employee);
				return { ...employee };
			});
	};

	const countAll = (filter) => {
		return Promise.resolve(source)
			.then(filterItemsByName(filter && filter.name))
			.then(filteredEmployees => filteredEmployees.length);
	};

	const getAll = (skip = 0, first = 10, filter, orderBy) => {
		return Promise.resolve(source)
		.then(filterItemsByName(filter && filter.name))
		.then(filteredEmployees => {
			if (orderBy) {
				if (orderBy.name) {
					return filteredEmployees.sort(sortByProperty(orderBy.name, 'name'));
				} else if (orderBy.skills) {
					return Promise.all(filteredEmployees.map(loadEmployeeSkillsCount))
						.then(filteredEmployees => filteredEmployees.sort(sortByProperty(orderBy.skills, 'skillsCount', sortByProperty(1, 'name'))));
				}
			}
			return filteredEmployees;
		})
		.then(filteredEmployees => filteredEmployees.slice(skip, skip + first))
		.then(selectedEmployees => selectedEmployees.map(e => ({ ...e })));
	};

	const getById = id => Promise.resolve(source)
		.then(employees => employees.find(e => e.id === id))
		.then(employee => {
			if (employee) {
				return { ...employee };
			}
		});

	const loadEmployeeSkillsCount = employee => repositories.employeesSkills.countByEmployeeId(employee.id)
		.then(employeeSkillsCount => {
			employee.skillsCount = employeeSkillsCount;
			return employee;
		});
		
	const remove = id => {
		return Promise.resolve(source)
			.then(employees => {
				const employeeIndex = employees.findIndex(e => e.id === id);
				if (employeeIndex > -1) {
					return employees.splice(employeeIndex, 1)[0];
				}
			});
	};

	const update = (id, name) => {
		return Promise.resolve(source)
			.then(employees => employees.find(e => e.id === id))
			.then(employee => {
				if (employee) {
					employee.name = name;
					return { ...employee };
				}
			});
	};

	return {
		add,
		countAll,
		getAll,
		getById,
		remove,
		update
	};
};

module.exports = employeesRepositoryFactory;
