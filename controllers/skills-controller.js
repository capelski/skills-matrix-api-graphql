var employeesService = require('../services/employees-service');
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

    var previousSkill = skillsService.getById(skillData.Id);
    var updatedSkill = skillsService.update(skillData);

    // Since there is no db actually, we also need to update the related employees in memory
    _removeSkillFromEmployees(previousSkill);
    _addSkillToEmployees(updatedSkill);

    return res.json(updatedSkill);
};

const _removeSkillFromEmployees = previousSkill => {
    if (previousSkill) {
        // Remove the skill from all the emplpoyees that had before
        previousSkill.Employees.forEach(employeeData => {
            var employee = employeesService.getById(employeeData.Id);
            employee.Skills = employee.Skills.filter(s => s.Id != previousSkill.Id);
            employeesService.update(employee);
        });
    }
};

const _addSkillToEmployees = updatedSkill => {
    if (updatedSkill) {
        var employees = updatedSkill.Employees;
        updatedSkill.Employees = [];
        // Add the skill to all the employees that currently has
        employees.forEach(employeeData => {
            var employee = employeesService.getById(employeeData.Id);
            employee.Skills.push(updatedSkill);
            employeesService.update(employee);
        });
        updatedSkill.Employees = employees;
    }
};

module.exports = {
    create,
    deleteSkill,
    getAll,
    getById,
    getRearest,
    update
};