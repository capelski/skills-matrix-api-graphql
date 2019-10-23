const skillsService = (repositories) => {
	const create = skillData => {
		return repositories.skills.add(skillData.name)
		.then(skill => {
			return Promise.all(
				skillData.employeesId.map(employeeId =>
					repositories.employeesSkills.add({skillId: skill.id, employeeId: employeeId})
				)
			)
			.then(() => skill);
		});
	}

	const getAll = (skip, first, filter, orderBy) => {
		return repositories.skills.getAll(skip, first, filter, orderBy)
		.then(skills => {
			return repositories.skills.countAll(filter)
			.then(totalCount => ({
				items: skills,
				totalCount
			}));
		});
	};

	const getById = id => repositories.skills.getById(id);

	const getSkillEmployees = (skillId, filter, skip, first, orderBy) => {
		return repositories.employeesSkills.getBySkillId(skillId, skip, first, filter, orderBy)
			.then(employees => {
				return repositories.employeesSkills.countBySkillId(skillId, filter)
				.then(totalCount => ({
					items: employees,
					totalCount
				}));
			});
	};

	const remove = id => {
		return getById(id)
		.then(skill => {
			if (skill) {
				return Promise.all([
					repositories.skills.remove(id),
					repositories.employeesSkills.removeBySkillId(id)
				])
				.then(() => skill);
			}
			return undefined;
		});
	};

	const update = skillData => {
		return getById(skillData.id)
		.then(skill => {
			if (skill && skillData.name) {
				return repositories.skills.update(skill.id, skillData.name);
			}
			return skill;
		})
		.then(skill => {		
			if (skill && skillData.employeesId) {
				return repositories.employeesSkills.removeBySkillId(skill.id)
					.then(() => {
						const promises = skillData.employeesId.map(employeeId => repositories.employeesSkills.add({skillId: skill.id, employeeId}));
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

module.exports = skillsService;
