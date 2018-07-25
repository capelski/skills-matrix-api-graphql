const Sequelize = require('sequelize');
const { express } = require('modena');
const router = express.Router();
const employeesControllerFactory = require('./controllers/employees-controller');
const skillsContollerFactory = require('./controllers/skills-controller');

const configureRouter = (middleware) => {
	// TODO Provide the Sequelize data from the configuration files
	const sequelize = new Sequelize('skills_matrix', 'user', 'password', {
		host: 'localhost',
		dialect: 'mysql',
	});

	let error = false;
	// TODO Once Sequelize is setup, remove unnecessary stuff
	return sequelize.authenticate().catch(_ => { error = true }).then(() => {

		return sequelize.sync().catch(_ => { error = true })
		.then(_ => {

			let employeesController, skillsContoller;
			if (error) {
				employeesController = employeesControllerFactory(require('./services/in-memory-employees-service'));
				skillsContoller = skillsContollerFactory(require('./services/in-memory-skills-service'));
			}
			else {
				// TODO Actually implement the database services
				employeesController = employeesControllerFactory(require('./services/database-employees-service'));
				skillsContoller = skillsContollerFactory(require('./services/database-skills-service'));
			}

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
		});
	});
}

module.exports = { configureRouter };
