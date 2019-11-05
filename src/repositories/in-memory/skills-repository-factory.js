const { filterItemsByName, sortByProperty } = require('./shared');

const skillsRepositoryFactory = repositories => {
    const source = require('./data/skills.json').map(s => ({ ...s }));
    let nextSkillId = source.length + 1;

    const add = name => {
        return Promise.resolve(source).then(skills => {
            const skill = { id: nextSkillId++, name };
            skills.push(skill);
            return { ...skill };
        });
    };

    const countAll = filter => {
        return Promise.resolve(source)
            .then(filterItemsByName(filter && filter.name))
            .then(filteredSkills => filteredSkills.length);
    };

    const getAll = (skip = 0, first = 10, filter, orderBy) => {
        return Promise.resolve(source)
            .then(filterItemsByName(filter && filter.name))
            .then(filteredSkills => {
                if (orderBy) {
                    if (orderBy.name) {
                        return filteredSkills.sort(sortByProperty('name', orderBy.name));
                    } else if (orderBy.employees) {
                        return Promise.all(filteredSkills.map(loadSkillEmployeesCount)).then(
                            filteredSkills =>
                                filteredSkills.sort(
                                    sortByProperty(
                                        'employeesCount',
                                        orderBy.employees,
                                        sortByProperty('name', orderBy.name)
                                    )
                                )
                        );
                    }
                }
                return filteredSkills;
            })
            .then(filteredSkills => filteredSkills.slice(skip, skip + first))
            .then(selectedSkills => selectedSkills.map(s => ({ ...s })));
    };

    const getById = id =>
        Promise.resolve(source)
            .then(skills => skills.find(s => s.id === id))
            .then(skill => {
                if (skill) {
                    return { ...skill };
                }
            });

    const loadSkillEmployeesCount = skill =>
        repositories.employeesSkills.countBySkillId(skill.id).then(skillEmployeesCount => {
            skill.employeesCount = skillEmployeesCount;
            return skill;
        });

    const remove = id => {
        return Promise.resolve(source).then(skills => {
            const skillIndex = skills.findIndex(e => e.id === id);
            if (skillIndex > -1) {
                return skills.splice(skillIndex, 1)[0];
            }
        });
    };

    const update = (id, name) => {
        return Promise.resolve(source)
            .then(skills => skills.find(s => s.id === id))
            .then(skill => {
                if (skill) {
                    skill.name = name;
                    return { ...skill };
                }
            });
    };

    return {
        add,
        countAll,
        getAll,
        getById,
        remove,
        update
    };
};

module.exports = skillsRepositoryFactory;
