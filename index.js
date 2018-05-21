var express = require('express');
var router = express.Router();
var path = require('path');
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
		employeeService.create(employee);
		return res.json(employee);
	}]);

	return router;
}

module.exports = { configureRouter };
