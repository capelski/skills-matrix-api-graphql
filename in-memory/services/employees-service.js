var employeesRepository = require('../repositories/employees-repository');
var skillsRepository = require('../repositories/skills-repository');
var nextEmployeeId = employeesRepository.getAll().length + 1;

const create = employee => {
	employee.Id = nextEmployeeId++;
	employeesRepository.add(employee);

	// Since there is no db actually, we also need to update the related skills in memory
	_addEmployeeToSkills(employee);
	
	return employee;
}

const deleteEmployee = id => {
	var employee = getById(id);
	employeesRepository.remove(id);
	
	// Since there is no db actually, we also need to update the related skills in memory
	_removeEmployeeFromSkills(employee);
	
	return employee;
};

const getAll = (filter, page, pageSize) => {
	var filteredEmployees = employeesRepository.getAll();
	if (filter) {
		filter = filter.toLowerCase();
		filteredEmployees = filteredEmployees.filter(e => e.Name.toLowerCase().indexOf(filter) > -1);
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

const getById = id => employeesRepository.getById(id);

const getMostSkilled = () => {
	var mostSkilledEmployees = employeesRepository.getAll().concat().sort((a, b) => {
		if(a.Skills.length > b.Skills.length) return -1;
		if(a.Skills.length < b.Skills.length) return 1;
		return a.Name < b.Name ? -1 : (a.Name > b.Name ? 1 : 0);
	});
	return mostSkilledEmployees.slice(0, 5);
};

const update = employeeData => {
	var employee = getById(employeeData.Id);

    // Since there is no db actually, we also need to update the related skills in memory
    _removeEmployeeFromSkills(employee);
	
	if (employee) {
		employee.Name = employeeData.Name;
		employee.Skills = employeeData.Skills;
	}

	// Since there is no db actually, we also need to update the related skills in memory
	_addEmployeeToSkills(employee);

	return employee;
};

const _removeEmployeeFromSkills = employee => {
    if (employee) {
        // Remove the employee from all the skills that had before
        employee.Skills.forEach(skillData => {
            var skill = skillsRepository.getById(skillData.Id);
            skill.Employees = skill.Employees.filter(e => e.Id != employee.Id);
            skillsRepository.update(skill);
        });
    }
};

const _addEmployeeToSkills = employee => {
    if (employee) {
        var skills = employee.Skills;
        employee.Skills = [];
        // Add the employee to all the skills that currently has
        skills.forEach(skillData => {
            var skill = skillsRepository.getById(skillData.Id);
            skill.Employees.push(employee);
            skillsRepository.update(skill);
        });
        employee.Skills = skills;
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
