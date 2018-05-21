var employees = require('./employees.json');

const getAll = (filter, page, pageSize) => {
	var filteredEmployees = employees;
	if (filter) {
		filteredEmployees = employees.filter(e => e.Name.indexOf(filter));
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

const getById = (id) => {
	const employee = employees.find(e => e.Id == id);
	return employee;
};

module.exports = {
	getAll,
	getById
};
