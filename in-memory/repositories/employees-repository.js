var employees = require('../data/employees.json');

employees = employees.sort((a, b) => {
	if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
});

const add = employee => {
	employees.push(employee);
};

const getAll = () => employees;

const getById = id => employees.find(e => e.id == id);

const remove = id => {
	employees = employees.filter(e => e.id != id);
};

const update = employeeData => {
	var employee = getById(employeeData.id);
	if (employee) {
		employee.name = employeeData.name;
		employee.skills = employeeData.skills;
	}
	return employee;
};

module.exports = {
	add,
	getAll,
	getById,
	remove,
	update
};
