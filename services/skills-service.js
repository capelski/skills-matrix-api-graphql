var skillsRepository = require('../repositories/skills-repository');
var nextSkillId = skillsRepository.getAll().length + 1;

const create = skill => {
	skill.Id = nextSkillId++;
	skillsRepository.add(employee);
	return skill;
}

const deleteSkill = id => {
	var skill = getById(id);
	skillsRepository.remove(id);
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
	if (skill) {
		skill.Name = skillData.Name;
		skill.Employees = skillData.Employees;
	}
	return skill;
};

module.exports = {
	create,
	deleteSkill,
	getAll,
	getById,
	getRearest,
	update
};
