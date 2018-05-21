var express = require('express');
var router = express.Router();
var path = require('path');
var employeeService = require('./services/employee-service');

const configureRouter = (middleware) => {
	router.get('/api/employee', function (req, res, next) {
		const filter = req.query.filter;
		const page = parseInt(req.query.page) || 0;
		const pageSize = parseInt(req.query.pageSize) || 10;
		const employees = employeeService.getAll(filter, page, pageSize);
		return res.json(employees);
	});
	router.get('/api/employee/getById', function (req, res, next) {
		const id = req.query.id;
		const employee = employeeService.getById(id);
		return res.json(employee);
	});

	return router;
}

module.exports = { configureRouter };
