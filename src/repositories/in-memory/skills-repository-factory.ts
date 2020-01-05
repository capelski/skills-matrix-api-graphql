import skillsData from '../../../features/data/skills.json';
import { Repositories, Skill, SkillFilter, SkillOrderBy, SkillsRepository } from '../types';
import { filterItemsByName, sortByProperty } from './shared';

export default (repositories: Repositories): SkillsRepository => {
    const source: Skill[] = skillsData.map((s: any) => ({ ...s }));
    let nextSkillId = source.length + 1;

    const add = (name: string) => {
        return Promise.resolve(source).then(skills => {
            const skill = { id: nextSkillId++, name };
            skills.push(skill);
            return { ...skill };
        });
    };

    const countAll = (filter?: SkillFilter) => {
        return Promise.resolve(source)
            .then(filterItemsByName(filter && filter.name))
            .then(filteredSkills => filteredSkills.length);
    };

    const getAll = (skip = 0, first = 10, filter?: SkillFilter, orderBy?: SkillOrderBy) => {
        return Promise.resolve(source)
            .then(filterItemsByName(filter && filter.name))
            .then(filteredSkills => {
                if (orderBy) {
                    if (orderBy.name) {
                        return filteredSkills.sort(sortByProperty('name', orderBy.name));
                    } else if (orderBy.employees) {
                        return Promise.all(filteredSkills.map(loadSkillEmployeesCount)).then(
                            extendedSkills =>
                                extendedSkills.sort(
                                    sortByProperty(
                                        'employeesCount',
                                        orderBy.employees!,
                                        sortByProperty('name', 1)
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

    const getById = (id: number) =>
        Promise.resolve(source)
            .then(skills => skills.find(s => s.id === id))
            .then(skill => {
                if (skill) {
                    return { ...skill };
                }
            });

    const getByIds = (ids: number[]) =>
        Promise.resolve(source).then(skills =>
            skills.filter(s => ids.indexOf(s.id) > -1).map(s => ({ ...s }))
        );

    const loadSkillEmployeesCount = (skill: Skill): Promise<Skill & { employeesCount: number }> =>
        repositories.employeesSkills.countBySkillId(skill.id).then(skillEmployeesCount => {
            return {
                ...skill,
                employeesCount: skillEmployeesCount
            };
        });

    const remove = (id: number) => {
        return Promise.resolve(source).then(skills => {
            const skillIndex = skills.findIndex(e => e.id === id);
            if (skillIndex > -1) {
                return skills.splice(skillIndex, 1)[0];
            }
        });
    };

    const update = (id: number, name: string) => {
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
        getByIds,
        remove,
        update
    };
};
