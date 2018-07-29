var skills = require('../data/skills.json');

skills = skills.sort((a, b) => {
	if(a.Name < b.Name) return -1;
    if(a.Name > b.Name) return 1;
    return 0;
});

const add = skill => {
	skills.push(skill);
}

const getAll = () => skills;

const getById = id => skills.find(s => s.Id == id);

const remove = id => {
	skills = skills.filter(s => s.Id != id);
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
	add,
	getAll,
	getById,
	remove,
	update
};
