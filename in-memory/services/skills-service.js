var employeesRepository = require('../repositories/employees-repository');
var skillsRepository = require('../repositories/skills-repository');
var nextSkillId = skillsRepository.getAll().length + 1;

const create = skill => {
	skill.Id = nextSkillId++;
	skillsRepository.add(employee);

	// Since there is no db actually, we also need to update the related employees in memory
	_addSkillToEmployees(skill);
	
	return skill;
}

const deleteSkill = id => {
	var skill = getById(id);
	skillsRepository.remove(id);

    // Since there is no db actually, we also need to update the related employees in memory
	_removeSkillFromEmployees(skill);
	
	return skill;
};

const getAll = (filter, page, pageSize) => {
	var filteredSkills = skillsRepository.getAll();
	if (filter) {
		filter = filter.toLowerCase();
		filteredSkills = filteredSkills.filter(s => s.Name.toLowerCase().indexOf(filter) > -1);
	}

	const offset = page * pageSize;
	const pagedList = {
		CurrentPage: page,
		Items: filteredSkills.slice(offset, offset + pageSize + 1),
		TotalPages: Math.ceil(filteredSkills.length / pageSize),
		TotalRecords: filteredSkills.length
	};

	return pagedList;
};

const getById = id => skillsRepository.getById(id);

const getRearest = () => {
	var rearestSkills = skillsRepository.getAll().concat().sort((a, b) => {
		if(a.Employees.length < b.Employees.length) return -1;
		if(a.Employees.length > b.Employees.length) return 1;
		return a.Name < b.Name ? -1 : (a.Name > b.Name ? 1 : 0);
	});
	return rearestSkills.slice(0, 5);
};

const update = skillData => {
	var skill = getById(skillData.Id);

    // Since there is no db actually, we also need to update the related employees in memory
	_removeSkillFromEmployees(skill);
	
	if (skill) {
		skill.Name = skillData.Name;
		skill.Employees = skillData.Employees;
	}

	// Since there is no db actually, we also need to update the related employees in memory
	_addSkillToEmployees(skill);

	return skill;
};

const _removeSkillFromEmployees = skill => {
    if (skill) {
        // Remove the skill from all the emplpoyees that had before
        skill.Employees.forEach(employeeData => {
            var employee = employeesRepository.getById(employeeData.Id);
            employee.Skills = employee.Skills.filter(s => s.Id != skill.Id);
            employeesRepository.update(employee);
        });
    }
};

const _addSkillToEmployees = skill => {
    if (skill) {
        var employees = skill.Employees;
        skill.Employees = [];
        // Add the skill to all the employees that currently has
        employees.forEach(employeeData => {
            var employee = employeesRepository.getById(employeeData.Id);
            employee.Skills.push(skill);
            employeesRepository.update(employee);
        });
        skill.Employees = employees;
    }
};

module.exports = {
	create,
	deleteSkill,
	getAll,
	getById,
	getRearest,
	update
};
