const { Router } = require('express');

class Routers {
    /**
     * 
     * @param {object} options 
     * @param { Controllers } options.controllers
     * @param { Database.SqlDatabse } options.database
     */
    constructor({ controllers, database }) {
        this.database = database;
        this.userController = new controllers.UserController(this.database);
        this.productController = new controllers.ProductController(this.database);
        this.orderController = new controllers.OrderController(this.database);

        this.routes = Router();

        this.routes.post('/users/create', (req, res, next) => this.userController.createUser(req, res));
        this.routes.get('/users/list', (req, res, next) => this.userController.getListUser(req, res));

        this.routes.get('/orders/orderId', (req, res, next) => this.orderController.gerOrderById(req, res))
        this.routes.post('/orders/create', (req, res, next) => this.orderController.createOrder(req, res));
        this.routes.get('/orders/list', (req, res, next) => this.orderController.getListOrders(req, res));

        this.routes.post('/products/create', (req, res, next) => this.productController.createProduct(req, res));
        this.routes.get('/products/list', (req, res, next) => this.productController.getListProducts(req, res));
        this.routes.get('/products/sku', (req, res, next) => this.productController.getProductBySku(req, res));
    }

    loadRoutes() {
        return this.routes;
    }
}

module.exports = Routers;
