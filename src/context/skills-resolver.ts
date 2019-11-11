import { Repositories, SkillFilter, SkillOrderBy } from '../repositories/types';
import { SkillsResolver, SkillCreateData, SkillUpdateData } from './types';

export default (repositories: Repositories): SkillsResolver => {
    const create = (skillData: SkillCreateData) => {
        return repositories.skills.add(skillData.name).then(skill => {
            return Promise.all(
                skillData.employeesId.map(employeeId =>
                    repositories.employeesSkills.add({ skillId: skill.id, employeeId: employeeId })
                )
            ).then(() => skill);
        });
    };

    const getAll = (skip = 0, first = 10, filter?: SkillFilter, orderBy?: SkillOrderBy) => {
        return repositories.skills.getAll(skip, first, filter, orderBy).then(skills => {
            return repositories.skills.countAll(filter).then(totalCount => ({
                items: skills,
                totalCount
            }));
        });
    };

    const getById = (id: number) => repositories.skills.getById(id);

    const getSkillEmployees = (
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

    const remove = (id: number) => {
        return getById(id).then(skill => {
            if (skill) {
                return repositories.employeesSkills
                    .removeBySkillId(id)
                    .then(() => repositories.skills.remove(id))
                    .then(() => skill);
            }
            return undefined;
        });
    };

    const update = (skillData: SkillUpdateData) => {
        return getById(skillData.id)
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

    return {
        create,
        getAll,
        getById,
        getSkillEmployees,
        remove,
        update
    };
};
