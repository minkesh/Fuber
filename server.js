import express from 'express';
import routes from './dist/routes';

const app = express();

app.use(express.static(__dirname + '/public'));
app.listen(3000, ()=> {
   console.log('App running on port 3000');
});

for (const route in routes) {
        if ({}.hasOwnProperty.call(routes, route)) {
            const routeInfo = routes[route].getRouteInfo();

            app.use(routeInfo.basePath + routeInfo.path, routeInfo.route);
        }
}

module.exports = app;
