const express = require('express');
const { Order } = require('../../model')

module.exports = class OrderController {
    /**
     * 
     * @param {Database.SqlDatabse} database 
     */
    constructor(database) {
        this.database = database;
    }

    /**
     * 
     * @param {express.Request} req
     * @param {express.Response} rest
     */
        async gerOrderById(req, rest) {
            try {
                const { orderId } = req.query;
                const query = this.database.useSelectQueryByField('orders', 'orderId', orderId);
                const data = await this.database.consultQuery(query);
        
                return rest.status(200).json({ data })
            } catch(err) {
                console.error(`[ERROR]: ${ this.gerOrderById.name }, ${ err }`);
                return rest.status(403).json({
                    message: err,
                })
            }
        }

    /**
     * 
     * @param {express.Request} req
     * @param {express.Response} rest
     */
    async createOrder(req, rest) {
        try {
            const { items } = req.body;
            
            const itemsData = await Promise.all(items.map(async item => {
                const { sku } = item;
                const queryString = this.database.useSelectQueryByField('products', 'sku', sku);
                const result = await this.database.consultQuery(queryString);
                
                const [data] = result;
                return data;
            }));

            const totalValue = itemsData.reduce((accumulator, currentItem) => {
                return accumulator + currentItem.unitValue;
            }, 0);

            
            const dateCreated = new Date().toISOString().split('T')[0];
            
            const orderCreated = new Order( { dateCreated, totalValue } );
            
            const queryString = this.database.useInsertQuery('orders', orderCreated);
            
            await this.database.consultQuery(queryString);
            const result = await this.database.consultQuery('SELECT LAST_INSERT_ID() as orderId');

            const [lastOrder] = result;
            const { orderId } = lastOrder;

            orderCreated.setOrderId(orderId);
            orderCreated.setItems(itemsData);


            await this.saveOrderItemsInDatabase(itemsData, orderId);


            return rest.status(200).json({ items });

        } catch(err) {
            console.error(`[ERROR]: ${ this.createOrder.name }, ${ err }`);

            return rest.status(403).json({
                message: err,
            })
        }
    }

    /**
     * 
     * @param {express.Request} req
     * @param {express.Response} rest
     */
    async getListOrders(req, rest) {
        try {
            const queryString = this.getQueryOrdersList();
            const results = await this.database.consultQuery(queryString);
            const orders = [];
    
            const ordersMap = new Map();
            results.forEach(row => {
                if (!ordersMap.has(row.orderId)) {
                    ordersMap.set(row.orderId, {
                        orderId: row.orderId,
                        totalValue: row.totalValue,
                        items: []
                    });
                }
                ordersMap.get(row.orderId).items.push({
                    sku: row.sku,
                    productName: row.productName,
                    unitValue: row.unitValue,
                    quantity: row.quantidade
                });
            });
    
            for (const order of ordersMap.values()) {
                orders.push(order);
            }
    
            return rest.status(200).json({ data: orders });
        } catch(err) {
            console.error(`[ERROR]: ${this.getListOrders.name}, ${err}`);

            return rest.status(403).json({
                message: err,
            })
        }
    }

    /**
     * 
     * @param {ProductT[]} orderItems 
     */
    async saveOrderItemsInDatabase(orderItems, orderId) {
        if (Array.isArray(orderItems) && orderItems.length) {
            await Promise.all(orderItems.map(async item => {
                const { sku } = item;

                const queryString = this.database.useInsertQuery('orderitems', { orderId, sku })

                await this.database.consultQuery(queryString);
            }));
        }
    }

    getQueryOrdersList() {
        const tables = ['orders', 'orderItems', 'products'];
        const conditions = ['orders.orderId = orderItems.orderId', 'orderItems.sku = products.sku'];

        const query = this.database.useRelationshipSelectQuery(tables, conditions);        

        return query;
    }

};
