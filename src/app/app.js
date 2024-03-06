const express = require('express');
const { Routers } = require('../routers');
const { SqlDatabse }  = require('../database');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const bodyParser = require('body-parser');

class BubbleApplication {
    /**
     * @param {object} options
     * @param {Env} options.env 
     * @param {Controllers} options.controllers
     */
    constructor({ env, controllers }) {
        this.serverPortConfig = env.SERVER.PORT;
        this.authConfig = env.AUTH;
        this.controllers = controllers;

        this.database = new SqlDatabse();
        this.authMiddleware = new AuthMiddleware(env.AUTH.KEY);
        this.routers = new Routers({ database: this.database, controllers: this.controllers });
        
        this.server = express();

        this.useMiddlewares();
        this.useRoutes();
        this.useDatabase();
    }

    useDatabase() {
        this.database.connectDatabase();
    }

    useRoutes() {
        this.server.use('/', this.routers.loadRoutes());
    }

    useMiddlewares() {
        this.server.use('/', (req, res, next) => {
            this.authMiddleware.authenticateApiKey(req, res, next);
        });
        this.server.use(bodyParser.json());
    }

    runApp() {
        this.server.listen(this.serverPortConfig);
        console.info(`${this.server.name} listening to http://${this.serverPortConfig}`);
    }
}

module.exports = {
    BubbleApplication,
};
