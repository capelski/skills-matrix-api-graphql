let skills = require('./data/skills.json');
// let nextSkillId = skills.length + 1;

// TODO All operations should return a copy of the object to reflect the database nature

const skillsRepositoryFactory = (repositories) => {	
	// const add = ({ name }) => {
	// 	const skill = { id: nextSkillId++, name };
	// 	skills.push(skill);
	// 	return Promise.resolve(skill);
	// };

	const countAll = (filter) => {
		return Promise.resolve(skills)
			.then(filterSkills(filter))
			.then(filteredSkills => filteredSkills.length);
	};

	const filterSkills = (filter) => (skills) => {
		if (filter && filter.name) {
			const nameFilter = filter.name.toLowerCase();
			skills = skills.filter(s => s.name.toLowerCase().indexOf(nameFilter) > -1);
		}
		return Promise.resolve(skills);
	};

	const getAll = (skip = 0, first = 10, filter, orderBy) => {
		return Promise.resolve([...skills])
		.then(filterSkills(filter))
		.then(filteredSkills => {
			if (orderBy) {
				if (orderBy.name) {
					return filteredSkills.sort(sortByName(orderBy.name));
				} else if (orderBy.employees) {
					return Promise.all(filteredSkills.map(loadSkillEmployeesCount))
						.then(filteredSkills => filteredSkills.sort(sortByEmployeesLength(orderBy.employees)));
				}
			}
			return filteredSkills;
		})
		.then(filteredSkills => filteredSkills.slice(skip, skip + first));
	};

	const getById = id => Promise.resolve(skills.find(s => s.id === id));

	const loadSkillEmployeesCount = skill => repositories.employeesSkills.countBySkillId(skill.id)
		.then(skillEmployeesCount => {
			skill.employeesCount = skillEmployeesCount;
			return skill;
		});

	const sortByEmployeesLength = (criteria) => (a, b) => {
		if (a.employeesCount < b.employeesCount) return -criteria;
		if (a.employeesCount > b.employeesCount) return criteria;
		return sortByName(1)(a, b);
	};

	const sortByName = (criteria) => (a, b) => {
		if (a.name < b.name) return -criteria;
		if (a.name > b.name) return criteria;
		return 0;
	};

	// const remove = id => {
	// 	skills = skills.filter(s => s.id !== id);
	// 	return Promise.resolve();
	// };

	// const update = skillData => {
	// 	const skill = getById(skillData.id);
	// 	if (skill) {
	// 		skill.name = skillData.name;
	// 	}
	// 	return Promise.resolve(skill);
	// };

	return {
		// add,
		countAll,
		getAll,
		getById
		// remove,
		// update
	};
};

module.exports = skillsRepositoryFactory;
