var employeesService = require('../services/employees-service');

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
    var employee = employeesService.update(employeeData);
    return res.json(employee);
};

module.exports = {
    create,
    deleteEmployee,
    getAll,
    getById,
    getMostSkilled,
    update
};