var skills = require('../data/skills.json');

skills = skills.sort((a, b) => {
	if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
});

const add = skill => {
	skills.push(skill);
}

const getAll = () => skills;

const getById = id => skills.find(s => s.id == id);

const remove = id => {
	skills = skills.filter(s => s.id != id);
};

const update = skillData => {
	var skill = getById(skillData.id);
	if (skill) {
		skill.name = skillData.name;
		skill.employees = skillData.employees;
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
