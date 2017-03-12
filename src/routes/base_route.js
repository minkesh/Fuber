import express from 'express';
const route = express.Router();

export default class BaseRoute {
    constructor() {
        this.route = route;
        this.basePath = '/api';
        this.path = '/';
    }

    getRouteInfo() {
        return {
            route: this.route,
            path: this.path,
            basePath: this.basePath
        };
    }
}
