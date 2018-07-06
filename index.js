const { express } = require('modena');
var router = express.Router();
var employeesController = require('./controllers/employees-controller');
var skillsContoller = require('./controllers/skills-controller');

const configureRouter = (middleware) => {
	router.get('/api/employee', employeesController.getAll);
	router.get('/api/employee/getById', employeesController.getById);
	router.get('/api/employee/getMostSkilled', employeesController.getMostSkilled);
	router.post('/api/employee', [middleware.bodyParser, employeesController.create]);
	router.put('/api/employee', [middleware.bodyParser, employeesController.update]);
	router.delete('/api/employee', employeesController.deleteEmployee);

	router.get('/api/skill', skillsContoller.getAll);
	router.get('/api/skill/getById', skillsContoller.getById);
	router.get('/api/skill/getRearest', skillsContoller.getRearest);
	router.post('/api/skill', [middleware.bodyParser, skillsContoller.create]);
	router.put('/api/skill', [middleware.bodyParser, skillsContoller.update]);
	router.delete('/api/skill', skillsContoller.deleteSkill);

	return router;
}

module.exports = { configureRouter };
