const Sequelize = require('sequelize');
const { express, tracer } = require('modena');
const router = express.Router();
const employeesControllerFactory = require('./controllers/employees-controller');
const skillsControllerFactory = require('./controllers/skills-controller');
const modelsDefinition = require('./database/models');

const syncDatabase = appConfig => {
	const dbConnection = new Sequelize(appConfig.database, appConfig.db_user, appConfig.db_password, {
		host: 'localhost',
		dialect: 'mysql',
		logging: false
	});

	const models = modelsDefinition(dbConnection, Sequelize);

	return dbConnection.sync()
		.then(() => ({
			isError: false,
			models,
			dbConnection
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
	let employeesController, skillsController;

	if (dbSyncResult.isError) {
		tracer.info('Instantiating in memory services for skills-matrix-api-node');
		const inMemoryEmployeesService = require('./in-memory/services/employees-service');
		const inMemorySkillsService = require('./in-memory/services/skills-service');
		employeesController = employeesControllerFactory(inMemoryEmployeesService);
		skillsController = skillsControllerFactory(inMemorySkillsService);
	}
	else {
		const dbEmployeesService = require('./database/services/employees-service')
			(dbSyncResult.models, dbSyncResult.dbConnection);
		const dbSkillsService = require('./database/services/skills-service')
			(dbSyncResult.models, dbSyncResult.dbConnection);
		employeesController = employeesControllerFactory(dbEmployeesService);
		skillsController = skillsControllerFactory(dbSkillsService);
	}

	return {
		employeesController,
		skillsController
	}
};

const registerRoutes = (controllers, middleware) => {
	router.get('/api/employee', controllers.employeesController.getAll);
	router.get('/api/employee/getById', controllers.employeesController.getById);
	router.get('/api/employee/getMostSkilled', controllers.employeesController.getMostSkilled);
	router.post('/api/employee', [middleware.bodyParser, controllers.employeesController.create]);
	router.put('/api/employee', [middleware.bodyParser, controllers.employeesController.update]);
	router.delete('/api/employee', controllers.employeesController.deleteEmployee);

	router.get('/api/skill', controllers.skillsController.getAll);
	router.get('/api/skill/getById', controllers.skillsController.getById);
	router.get('/api/skill/getRearest', controllers.skillsController.getRearest);
	router.post('/api/skill', [middleware.bodyParser, controllers.skillsController.create]);
	router.put('/api/skill', [middleware.bodyParser, controllers.skillsController.update]);
	router.delete('/api/skill', controllers.skillsController.deleteSkill);

	return router;
};

const configureRouter = (middleware, utils, appConfig) => {
	return syncDatabase(appConfig)
		.then(instantiateControllers)
		.then(controllers => registerRoutes(controllers, middleware));
}

module.exports = { configureRouter };
