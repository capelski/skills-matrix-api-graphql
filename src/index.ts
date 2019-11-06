import { Express } from 'express';
import { getExpressApp } from './get-express-app';

const appPromise = getExpressApp();
appPromise.then((app: Express) => {
    app.listen(3000, (error: any) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Express server listening on port 3000');
        }
    });
});
