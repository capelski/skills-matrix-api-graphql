let skills = require('./data/skills.json');
const employeesSkillsRepository = require('./employees-skills-repository');
// let nextSkillId = skills.length + 1;

// TODO All operations should return a copy of the object to reflect the database nature

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

const getAll = (filter, skip = 0, first = 10, includeEmployees = false, orderBy) => {
	return Promise.resolve([...skills])
	.then(filterSkills(filter))
	.then(filteredSkills => {
		if (orderBy) {
			if (orderBy.name) {
				filteredSkills.sort(sortByName(orderBy.name));
			} else if (orderBy.employees) {
				// TODO Fix sorting not working for employees length
				console.log('Sorting by employees length')
				return Promise.all(filteredSkills.map(loadSkillEmployees))
					.then(selectedSkills => selectedSkills.sort(sortByEmployeesLength(orderBy.name)));
			}
		}

		if (includeEmployees) {
			filteredSkills = filteredSkills.map(loadSkillEmployees);
		}
		
		return filteredSkills;
	})
	.then(selectedSkills => {
		selectedSkills = selectedSkills.slice(skip, skip + first);
		return Promise.resolve(selectedSkills);
	});
};

const getById = (id, includeEmployees) => Promise.resolve(skills.find(s => s.id === id))
	.then(skill => includeEmployees ? loadSkillEmployees(skill) : skill);

const loadSkillEmployees = skill => employeesSkillsRepository.getBySkillId(skill.id)
	.then(skillEmployees => {
		// TODO Resolve the cyclic dependencies problem
		const employeesRepository = require('./employees-repository');
		return Promise.all(skillEmployees.map(se => employeesRepository.getById(se.employeeId)))
	})
	.then(employees => {
		skill.employees = employees;
		return skill;
	});

const sortByEmployeesLength = (criteria) => (a, b) => {
	if (a.employees.length < b.employees.length) return -criteria;
	if (a.employees.length > b.employees.length) return criteria;
	return 0;
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

module.exports = {
	// add,
	countAll,
	getAll,
	getById
	// remove,
	// update
};
