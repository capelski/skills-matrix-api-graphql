var employees = require('./employees.json');
var nextEmployeeId = employees.length + 1;

employees = employees.sort((a, b) => {
	if(a.Name < b.Name) return -1;
    if(a.Name > b.Name) return 1;
    return 0;
});

const create = employee => {
	employee.Id = nextEmployeeId++;
	employees.push(employee);
	return employee;
}

const deleteEmployee = id => {
	var employee = getById(id);
	employees = employees.filter(e => e.Id != id);
	return employee;
};

const getAll = (filter, page, pageSize) => {
	var filteredEmployees = employees;
	if (filter) {
		filter = filter.toLowerCase();
		filteredEmployees = employees.filter(e => e.Name.toLowerCase().indexOf(filter) > -1);
	}

	const offset = page * pageSize;
	const pagedList = {
		CurrentPage: page,
		Items: filteredEmployees.slice(offset, offset + pageSize + 1),
		TotalPages: Math.ceil(filteredEmployees.length / pageSize),
		TotalRecords: filteredEmployees.length
	};

	return pagedList;
};

const getById = id => {
	const employee = employees.find(e => e.Id == id);
	return employee;
};

const getMostSkilled = () => {
	var mostSkilledEmployees = employees.concat().sort((a, b) => {
		if(a.Skills.length > b.Skills.length) return -1;
		if(a.Skills.length < b.Skills.length) return 1;
		return a.Name < b.Name ? -1 : (a.Name > b.Name ? 1 : 0);
	});
	return mostSkilledEmployees.slice(0, 5);
};

const update = employeeData => {
	var employee = getById(employeeData.Id);
	if (employee) {
		employee.Name = employeeData.Name;
		employee.Skills = employeeData.Skills;
	}
	return employee;
};

module.exports = {
	create,
	deleteEmployee,
	getAll,
	getById,
	getMostSkilled,
	update
};
