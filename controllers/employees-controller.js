var employeesService = require('../services/employees-service');
var skillsService = require('../services/skills-service');

const create = (req, res, next) => {
    var employee = req.body;
    employee = employeesService.create(employee);
    return res.json(employee);
};

const deleteEmployee = (req, res, next) => {
    const id = req.query.id;
    var employee = employeesService.deleteEmployee(id);
    return res.json(employee);
};

const getAll = (req, res, next) => {
    const keywords = req.query.keywords;
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const employees = employeesService.getAll(keywords, page, pageSize);
    return res.json(employees);
};

const getById = (req, res, next) => {
    const id = req.query.id;
    const employee = employeesService.getById(id);
    return res.json(employee);
};

const getMostSkilled = (req, res, next) => {
    const mostSkilledEmployees = employeesService.getMostSkilled();
    return res.json(mostSkilledEmployees);
};

const update = (req, res, next) => {
    var employeeData = req.body;
    
    var previousEmployee = employeesService.getById(employeeData.Id);
    var updatedEmployee = employeesService.update(employeeData);

    // Since there is no db actually, we also need to update the related skills in memory
    _removeEmployeeFromSkills(previousEmployee);
    _addEmployeeToSkills(updatedEmployee);

    return res.json(updatedEmployee);
};

const _removeEmployeeFromSkills = previousEmployee => {
    if (previousEmployee) {
        // Remove the employee from all the skills that had before
        previousEmployee.Skills.forEach(skillData => {
            var skill = skillsService.getById(skillData.Id);
            skill.Employees = skill.Employees.filter(e => e.Id != previousEmployee.Id);
            skillsService.update(skill);
        });
    }
};

const _addEmployeeToSkills = updatedEmployee => {
    if (updatedEmployee) {
        var skills = updatedEmployee.Skills;
        updatedEmployee.Skills = [];
        // Add the employee to all the skills that currently has
        skills.forEach(skillData => {
            var skill = skillsService.getById(skillData.Id);
            skill.Employees.push(updatedEmployee);
            skillsService.update(skill);
        });
        updatedEmployee.Skills = skills;
    }
};

module.exports = {
    create,
    deleteEmployee,
    getAll,
    getById,
    getMostSkilled,
    update
};