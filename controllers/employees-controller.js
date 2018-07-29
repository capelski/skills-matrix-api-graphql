const EmployeesController = (employeesService) => {

    const create = (req, res, next) => {
        var employee = req.body;
        return employeesService.create(employee)
            .then(employee => res.json(employee));
    };

    const deleteEmployee = (req, res, next) => {
        const id = req.query.id;
        return employeesService.deleteEmployee(id)
            .then(employee => res.json(employee));
    };

    const getAll = (req, res, next) => {
        const keywords = req.query.keywords;
        const page = parseInt(req.query.page) || 0;
        const pageSize = parseInt(req.query.pageSize) || 10;
        return employeesService.getAll(keywords, page, pageSize)
            .then(employees => res.json(employees));
    };

    const getById = (req, res, next) => {
        const id = req.query.id;
        return employeesService.getById(id)
            .then(employee => res.json(employee));
    };

    const getMostSkilled = (req, res, next) => {
        return employeesService.getMostSkilled()
            .then(mostSkilledEmployees => res.json(mostSkilledEmployees));
    };

    const update = (req, res, next) => {
        var employeeData = req.body;
        return employeesService.update(employeeData)
            .then(employee => res.json(employee));
    };

    return {
        create,
        deleteEmployee,
        getAll,
        getById,
        getMostSkilled,
        update
    };
};

module.exports = EmployeesController;
