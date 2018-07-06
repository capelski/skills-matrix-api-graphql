const { express } = require('modena');
var router = express.Router();
var employeeService = require('./services/employee-service');

const configureRouter = (middleware) => {
	router.get('/api/employee', function (req, res, next) {
		const keywords = req.query.keywords;
		const page = parseInt(req.query.page) || 0;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const employees = employeeService.getAll(keywords, page, pageSize);
		return res.json(employees);
	});
	router.get('/api/employee/getById', function (req, res, next) {
		const id = req.query.id;
		const employee = employeeService.getById(id);
		return res.json(employee);
	});
	router.post('/api/employee', [middleware.bodyParser, function (req, res, next) {
		var employee = req.body;
		employee = employeeService.create(employee);
		return res.json(employee);
	}]);
	router.put('/api/employee', [middleware.bodyParser, function (req, res, next) {
		var employeeData = req.body;
		var employee = employeeService.update(employeeData);
		return res.json(employee);
	}]);
	router.delete('/api/employee', function (req, res, next) {
		const id = req.query.id;
		var employee = employeeService.deleteEmployee(id);
		return res.json(employee);
	});

	return router;
}

module.exports = { configureRouter };
