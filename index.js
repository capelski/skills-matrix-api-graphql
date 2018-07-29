const Sequelize = require('sequelize');
const { express, tracer } = require('modena');
const router = express.Router();
const employeesControllerFactory = require('./controllers/employees-controller');
const skillsContollerFactory = require('./controllers/skills-controller');
const modelsDefinition = require('./database/models');
const config = require('./database/config/config.json');

const syncDatabase = () => {
	// TODO Modify modena to provide the config for each app
	const dbConnection = new Sequelize(config.database, config.db_user, config.db_password, {
		host: 'localhost',
		dialect: 'mysql'
	});

	const models = modelsDefinition(dbConnection, Sequelize);

	return dbConnection.sync()
		.then(() => ({
			isError: false,
			models
		}))
		.catch(error => {
			tracer.error('An error ocurred when trying to sync the database');
			tracer.error(error);
			return {
				isError: true
			};
		});
};

const instantiateControllers = dbSyncResult => {
	let employeesController, skillsContoller;

	if (dbSyncResult.isError) {
		tracer.info('Instantiating in memory services for skills-matrix-api-node');
		const inMemoryEmployeesService = require('./in-memory/services/employees-service');
		const inMemorySkillsService = require('./in-memory/services/skills-service');
		employeesController = employeesControllerFactory(inMemoryEmployeesService);
		skillsContoller = skillsContollerFactory(inMemorySkillsService);
	}
	else {
		const dbEmployeesService = require('./database/services/employees-service')(dbSyncResult.models);
		const dbSkillsService = require('./database/services/skills-service')(dbSyncResult.models);
		employeesController = employeesControllerFactory(dbEmployeesService);
		skillsContoller = skillsContollerFactory(dbSkillsService);
	}

	return {
		employeesController,
		skillsContoller
	}
};

const registerRoutes = (controllers, middleware) => {
	router.get('/api/employee', controllers.employeesController.getAll);
	router.get('/api/employee/getById', controllers.employeesController.getById);
	router.get('/api/employee/getMostSkilled', controllers.employeesController.getMostSkilled);
	router.post('/api/employee', [middleware.bodyParser, controllers.employeesController.create]);
	router.put('/api/employee', [middleware.bodyParser, controllers.employeesController.update]);
	router.delete('/api/employee', controllers.employeesController.deleteEmployee);

	router.get('/api/skill', controllers.skillsContoller.getAll);
	router.get('/api/skill/getById', controllers.skillsContoller.getById);
	router.get('/api/skill/getRearest', controllers.skillsContoller.getRearest);
	router.post('/api/skill', [middleware.bodyParser, controllers.skillsContoller.create]);
	router.put('/api/skill', [middleware.bodyParser, controllers.skillsContoller.update]);
	router.delete('/api/skill', controllers.skillsContoller.deleteSkill);

	return router;
};

const configureRouter = middleware => {
	return syncDatabase()
		.then(instantiateControllers)
		.then(controllers => registerRoutes(controllers, middleware));
}

module.exports = { configureRouter };
