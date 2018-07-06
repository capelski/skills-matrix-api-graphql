var skillsService = require('../services/skills-service');

const create = (req, res, next) => {
    var skill = req.body;
    skill = skillsService.create(skill);
    return res.json(skill);
};

const deleteSkill = (req, res, next) => {
    const id = req.query.id;
    var skill = skillsService.deleteSkill(id);
    return res.json(skill);
};

const getAll = (req, res, next) => {
    const keywords = req.query.keywords;
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skills = skillsService.getAll(keywords, page, pageSize);
    return res.json(skills);
};

const getById = (req, res, next) => {
    const id = req.query.id;
    const skill = skillsService.getById(id);
    return res.json(skill);
};

const getRearest = (req, res, next) => {
    const rearestSkills = skillsService.getRearest();
    return res.json(rearestSkills);
};

const update = (req, res, next) => {
    var skillData = req.body;
    var skill = skillsService.update(skillData);
    return res.json(skill);
};

module.exports = {
    create,
    deleteSkill,
    getAll,
    getById,
    getRearest,
    update
};
