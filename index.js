const { express } = require('modena');
var router = express.Router();
var employeeService = require('./services/employee-service');
var skillService = require('./services/skill-service');

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
	router.get('/api/employee/getMostSkilled', function (req, res, next) {
		const mostSkilledEmployees = employeeService.getMostSkilled();
		return res.json(mostSkilledEmployees);
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

	router.get('/api/skill', function (req, res, next) {
		const keywords = req.query.keywords;
		const page = parseInt(req.query.page) || 0;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const skills = skillService.getAll(keywords, page, pageSize);
		return res.json(skills);
	});
	router.get('/api/skill/getById', function (req, res, next) {
		const id = req.query.id;
		const skill = skillService.getById(id);
		return res.json(skill);
	});
	router.get('/api/skill/getRearest', function (req, res, next) {
		const rearestSkills = skillService.getRearest();
		return res.json(rearestSkills);
	});
	router.post('/api/skill', [middleware.bodyParser, function (req, res, next) {
		var skill = req.body;
		skill = skillService.create(skill);
		return res.json(skill);
	}]);
	router.put('/api/skill', [middleware.bodyParser, function (req, res, next) {
		var skillData = req.body;
		var skill = skillService.update(skillData);
		return res.json(skill);
	}]);
	router.delete('/api/skill', function (req, res, next) {
		const id = req.query.id;
		var skill = skillService.deleteSkill(id);
		return res.json(skill);
	});

	return router;
}

module.exports = { configureRouter };
