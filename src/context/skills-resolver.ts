import DataLoader from 'dataloader';
import { Repositories, SkillFilter, SkillOrderBy } from '../repositories/types';
import { dataLoaderMatcher } from './shared';
import { SkillCreateData, SkillsResolver, SkillUpdateData } from './types';

const create = (repositories: Repositories) => (skillData: SkillCreateData) => {
    return repositories.skills.add(skillData.name).then(skill => {
        return Promise.all(
            skillData.employeesId.map(employeeId =>
                repositories.employeesSkills.add({ skillId: skill.id, employeeId })
            )
        ).then(() => skill);
    });
};

const getAll = (repositories: Repositories) => (
    skip = 0,
    first = 10,
    filter?: SkillFilter,
    orderBy?: SkillOrderBy
) => {
    return repositories.skills.getAll(skip, first, filter, orderBy).then(skills => {
        return repositories.skills.countAll(filter).then(totalCount => ({
            items: skills,
            totalCount
        }));
    });
};

const getById = (repositories: Repositories) => (id: number) => repositories.skills.getById(id);

const getSkillEmployees = (repositories: Repositories) => (
    skillId: number,
    skip = 0,
    first = 10,
    filter?: SkillFilter,
    orderBy?: SkillOrderBy
) => {
    return repositories.employeesSkills
        .getBySkillId(skillId, skip, first, filter, orderBy)
        .then(employees => {
            return repositories.employeesSkills
                .countBySkillId(skillId, filter)
                .then(totalCount => ({
                    items: employees,
                    totalCount
                }));
        });
};

const remove = (repositories: Repositories) => (id: number) => {
    return getById(repositories)(id).then(skill => {
        if (skill) {
            return repositories.employeesSkills
                .removeBySkillId(id)
                .then(() => repositories.skills.remove(id))
                .then(() => skill);
        }
        return undefined;
    });
};

const update = (repositories: Repositories) => (skillData: SkillUpdateData) => {
    return getById(repositories)(skillData.id)
        .then(skill => {
            if (skill && skillData.name) {
                return repositories.skills.update(skill.id, skillData.name);
            }
            return skill;
        })
        .then(skill => {
            if (skill && skillData.employeesId) {
                return repositories.employeesSkills.removeBySkillId(skill.id).then(() => {
                    const promises = skillData.employeesId.map(employeeId =>
                        repositories.employeesSkills.add({ skillId: skill.id, employeeId })
                    );
                    return Promise.all(promises).then(() => skill);
                });
            }
            return skill;
        });
};

export const skillsResolver = (repositories: Repositories): SkillsResolver => ({
    create: create(repositories),
    getAll: getAll(repositories),
    getById: getById(repositories),
    getSkillEmployees: getSkillEmployees(repositories),
    remove: remove(repositories),
    update: update(repositories)
});

const getByIds = (repositories: Repositories) => (ids: number[]) =>
    repositories.skills.getByIds(ids).then(dataLoaderMatcher(ids));

export const skillsDataLoaderResolver = (repositories: Repositories): SkillsResolver => {
    const dataLoader = new DataLoader(getByIds(repositories));
    return {
        create: create(repositories),
        getAll: getAll(repositories),
        getById: (id: number) => dataLoader.load(id),
        getSkillEmployees: getSkillEmployees(repositories),
        remove: remove(repositories),
        update: update(repositories)
    };
};
