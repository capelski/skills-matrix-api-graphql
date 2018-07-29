var employees = require('../data/employees.json');

employees = employees.sort((a, b) => {
	if(a.Name < b.Name) return -1;
    if(a.Name > b.Name) return 1;
    return 0;
});

const add = employee => {
	employees.push(employee);
};

const getAll = () => employees;

const getById = id => employees.find(e => e.Id == id);

const remove = id => {
	employees = employees.filter(e => e.Id != id);
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
	add,
	getAll,
	getById,
	remove,
	update
};
