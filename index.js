const getExpressApp = require('./get-express-app');

const appPromise = getExpressApp();
appPromise.then(app => {
	app.listen(3000, error => {
		if (error) {
			console.error(error);
		}
		else {
			console.log('Express server listening on port 3000');
		}
	});
});