const bodyParser = require('body-parser');
const express = require('express');
const Sequelize = require('sequelize');
const employeesControllerFactory = require('./controllers/employees-controller');
const skillsControllerFactory = require('./controllers/skills-controller');
const modelsDefinition = require('./database/models');
// TODO Add dependencies:
// "mysql2": "^1.5.3",
// "sequelize": "^4.38.0",

const defaultConfig = {
	DATABASE: "db_name_placeholder",
    DB_USER: "db_user_placeholder",
    DB_PASSWORD: "db_password_placeholder"
};

const getExpressApp = (environmentConfig = {}) => syncDatabase(environmentConfig)
	.then(instantiateDbServices)
	.catch(instantiateInMemoryServices)
	.then(registerRoutes);

const instantiateDbServices = dbSyncResult => {
	console.info('Instantiating database services for skills-matrix-api-node');
	return {
		employees: require('./database/services/employees-service')(dbSyncResult.models, dbSyncResult.dbConnection),
		skills: require('./database/services/skills-service')(dbSyncResult.models, dbSyncResult.dbConnection)
	};
};

const instantiateInMemoryServices = () => {
	console.info('Instantiating in memory services for skills-matrix-api-node');
	return {
		employees: require('./in-memory/services/employees-service'),
		skills: require('./in-memory/services/skills-service')
	};
};

const registerRoutes = (services) => {
	const controllers = {
		employees: employeesControllerFactory(services.employees),
		skills: skillsControllerFactory(services.skills)
	};	
	const app = express();
	const bodyParserMiddleware = bodyParser.json();
	
	app.get('/api/employee', controllers.employees.getAll);
	app.get('/api/employee/getById', controllers.employees.getById);
	app.get('/api/employee/getMostSkilled', controllers.employees.getMostSkilled);
	app.post('/api/employee', [bodyParserMiddleware, controllers.employees.create]);
	app.put('/api/employee', [bodyParserMiddleware, controllers.employees.update]);
	app.delete('/api/employee', controllers.employees.deleteEmployee);

	app.get('/api/skill', controllers.skills.getAll);
	app.get('/api/skill/getById', controllers.skills.getById);
	app.get('/api/skill/getRearest', controllers.skills.getRearest);
	app.post('/api/skill', [bodyParserMiddleware, controllers.skills.create]);
	app.put('/api/skill', [bodyParserMiddleware, controllers.skills.update]);
	app.delete('/api/skill', controllers.skills.deleteSkill);

	return app;
};

const syncDatabase = config => {
	const dbConnection = new Sequelize(
		config.DATABASE || defaultConfig.DATABASE,
		config.DB_USER || defaultConfig.DB_USER,
		config.DB_PASSWORD || defaultConfig.DB_PASSWORD,
		{
			host: 'localhost',
			dialect: 'mysql',
			logging: false
		});

	const models = modelsDefinition(dbConnection, Sequelize);

	// We need to create a explicit Promise because sync returns a Bluebird instance
	return new Promise((resolve, reject) => {
		dbConnection.sync()
			.then(_ => resolve({
				models,
				dbConnection
			}))
			.catch(error => {
				console.error('An error ocurred when trying to sync the database:', error.message);
				reject();
			});
	});
};

module.exports = getExpressApp;
