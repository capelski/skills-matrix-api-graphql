const bodyParser = require('body-parser');
const express = require('express');
const employeesControllerFactory = require('./controllers/employees-controller');
const skillsControllerFactory = require('./controllers/skills-controller');
// const getConfiguration = require('./configuration');

const getExpressApp = (environmentConfig) => {
	// TODO: Eventually use the config to connect to a database
	// const config = getConfiguration(environmentConfig);

	return new Promise((resolve) => {
		const services = instantiateInMemoryServices();
		const app = registerRoutes(services);
		resolve(app);
	});
};

const instantiateInMemoryServices = () => {
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

module.exports = getExpressApp;
