var employeesRepository = require('../repositories/employees-repository');
var skillsRepository = require('../repositories/skills-repository');
var nextEmployeeId = employeesRepository.getAll().length + 1;

const create = employee => {
	employee.id = nextEmployeeId++;
	employeesRepository.add(employee);

	// Since there is no db actually, we also need to update the related skills in memory
	_addEmployeeToSkills(employee);
	
	return Promise.resolve(employee);
}

const deleteEmployee = id => {
	return getById(id)
	.then(employee => {
		employeesRepository.remove(id);
	
		// Since there is no db actually, we also need to update the related skills in memory
		_removeEmployeeFromSkills(employee);

		return employee;
	});
};

const getAll = (filter, page, pageSize) => {
	var filteredEmployees = employeesRepository.getAll();
	if (filter) {
		filter = filter.toLowerCase();
		filteredEmployees = filteredEmployees.filter(e => e.name.toLowerCase().indexOf(filter) > -1);
	}

	const offset = page * pageSize;
	const pagedList = {
		CurrentPage: page,
		Items: filteredEmployees.slice(offset, offset + pageSize),
		TotalPages: Math.ceil(filteredEmployees.length / pageSize),
		TotalRecords: filteredEmployees.length
	};

	return Promise.resolve(pagedList);
};

const getById = id => Promise.resolve(employeesRepository.getById(id));

const getMostSkilled = () => {
	const mostSkilledEmployees = employeesRepository.getAll().concat().sort((a, b) => {
		if(a.skills.length > b.skills.length) return -1;
		if(a.skills.length < b.skills.length) return 1;
		return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
	});

	return Promise.resolve(mostSkilledEmployees.slice(0, 5));
};

const update = employeeData => {
	return getById(employeeData.id)
	.then(employee => {
		// Since there is no db actually, we also need to update the related skills in memory
		_removeEmployeeFromSkills(employee);
			
		if (employee) {
			employee.name = employeeData.name;
			employee.skills = employeeData.skills;
		}

		// Since there is no db actually, we also need to update the related skills in memory
		_addEmployeeToSkills(employee);

		return employee;
	});
};

const _removeEmployeeFromSkills = employee => {
    if (employee) {
        // Remove the employee from all the skills that had before
        employee.skills.forEach(skillData => {
            var skill = skillsRepository.getById(skillData.id);
            skill.employees = skill.employees.filter(e => e.id != employee.id);
            skillsRepository.update(skill);
        });
    }
};

const _addEmployeeToSkills = employee => {
    if (employee) {
        var skills = employee.skills;
        employee.skills = [];
        // Add the employee to all the skills that currently has
        skills.forEach(skillData => {
            var skill = skillsRepository.getById(skillData.id);
            skill.employees.push(employee);
            skillsRepository.update(skill);
        });
        employee.skills = skills;
    }
};

module.exports = {
	create,
	deleteEmployee,
	getAll,
	getById,
	getMostSkilled,
	update
};
