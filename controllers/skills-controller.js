const SkillsController = (skillsService) => {

    const create = (req, res, next) => {
        var skill = req.body;
        return skillsService.create(skill)
            .then(skill => res.json(skill));
    };

    const deleteSkill = (req, res, next) => {
        const id = req.query.id;
        return skillsService.deleteSkill(id)
            .then(skill => res.json(skill));
    };

    const getAll = (req, res, next) => {
        const keywords = req.query.keywords;
        const page = parseInt(req.query.page) || 0;
        const pageSize = parseInt(req.query.pageSize) || 10;
        return skillsService.getAll(keywords, page, pageSize)
            .then(skills => res.json(skills));
    };

    const getById = (req, res, next) => {
        const id = req.query.id;
        return skillsService.getById(id)
            .then(skill => res.json(skill));
    };

    const getRearest = (req, res, next) => {
        return skillsService.getRearest()
            .then(rearestSkills => res.json(rearestSkills));
    };

    const update = (req, res, next) => {
        var skillData = req.body;
        return skillsService.update(skillData)
            .then(skill => res.json(skill));
    };

    return {
        create,
        deleteSkill,
        getAll,
        getById,
        getRearest,
        update
    };
};

module.exports = SkillsController;
