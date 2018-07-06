var skills = require('./skills.json');
var nextSkillId = skills.length + 1;

skills = skills.sort((a, b) => {
	if(a.Name < b.Name) return -1;
    if(a.Name > b.Name) return 1;
    return 0;
});

const create = skill => {
	skill.Id = nextSkillId++;
	skills.push(skill);
	return skill;
}

const deleteSkill = id => {
	var skill = getById(id);
	skills = skills.filter(e => e.Id != id);
	return skill;
};

const getAll = (filter, page, pageSize) => {
	var filteredSkills = skills;
	if (filter) {
		filteredSkills = skills.filter(e => e.Name.indexOf(filter) > -1);
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

const getById = id => {
	const skill = skills.find(e => e.Id == id);
	return skill;
};

const getRearest = () => {
	var rearestSkills = skills.concat().sort((a, b) => {
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
