var employeesRepository = require('../repositories/employees-repository');
var skillsRepository = require('../repositories/skills-repository');
var nextSkillId = skillsRepository.getAll().length + 1;

const create = skill => {
	skill.id = nextSkillId++;
	skillsRepository.add(employee);

	// Since there is no db actually, we also need to update the related employees in memory
	_addSkillToEmployees(skill);
	
	return Promise.resolve(skill);
}

const deleteSkill = id => {
	return getById(id)
	.then(skill => {
		skillsRepository.remove(id);

		// Since there is no db actually, we also need to update the related employees in memory
		_removeSkillFromEmployees(skill);
		
		return skill;
	});
};

const getAll = (filter, page, pageSize) => {
	var filteredSkills = skillsRepository.getAll();
	if (filter) {
		filter = filter.toLowerCase();
		filteredSkills = filteredSkills.filter(s => s.name.toLowerCase().indexOf(filter) > -1);
	}

	const offset = page * pageSize;
	const pagedList = {
		CurrentPage: page,
		Items: filteredSkills.slice(offset, offset + pageSize),
		TotalPages: Math.ceil(filteredSkills.length / pageSize),
		TotalRecords: filteredSkills.length
	};

	return Promise.resolve(pagedList);
};

const getById = id => Promise.resolve(skillsRepository.getById(id));

const getRearest = () => {
	var rearestSkills = skillsRepository.getAll().concat().sort((a, b) => {
		if(a.employees.length < b.employees.length) return -1;
		if(a.employees.length > b.employees.length) return 1;
		return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
	});
	
	return Promise.resolve(rearestSkills.slice(0, 5));
};

const update = skillData => {
	return getById(skillData.id)
	.then(skill => {
		// Since there is no db actually, we also need to update the related employees in memory
		_removeSkillFromEmployees(skill);
			
		if (skill) {
			skill.name = skillData.name;
			skill.employees = skillData.employees;
		}

		// Since there is no db actually, we also need to update the related employees in memory
		_addSkillToEmployees(skill);

		return skill;
	});
};

const _removeSkillFromEmployees = skill => {
    if (skill) {
        // Remove the skill from all the emplpoyees that had before
        skill.employees.forEach(employeeData => {
            var employee = employeesRepository.getById(employeeData.id);
            employee.skills = employee.skills.filter(s => s.id != skill.id);
            employeesRepository.update(employee);
        });
    }
};

const _addSkillToEmployees = skill => {
    if (skill) {
        var employees = skill.employees;
        skill.employees = [];
        // Add the skill to all the employees that currently has
        employees.forEach(employeeData => {
            var employee = employeesRepository.getById(employeeData.id);
            employee.skills.push(skill);
            employeesRepository.update(employee);
        });
        skill.employees = employees;
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
