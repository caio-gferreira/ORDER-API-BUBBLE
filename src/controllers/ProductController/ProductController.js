const express = require('express');
const { Product } = require('../../model')

module.exports = class ProductController {
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
    async getProductBySku(req, rest) {
        try {
            const { sku } = req.query;
            const query = this.database.useSelectQueryByField('products', 'sku', sku);
            const data = await this.database.consultQuery(query);
    
            return rest.json({ data })
        } catch (err) {
            console.error(`[ERROR]:  ${ProductController.name} in method ${this.getProductBySku.name}\n${error}`);

            return rest.json({
                message: err,
            })
        }
    }

    /**
     * 
     * @param {express.Request} req
     * @param {express.Response} rest
     */
    async getListProducts(req, rest) {
        const query = this.database.useSelectQuery('products');
        const data = await this.database.consultQuery(query);

        return rest.json({ data })
    }

    /**
     * 
     * @param {express.Request} req
     * @param {express.Response} rest
     */
    async createProduct(req, rest) {
        try {
            const { productName, sku, unitValue } = req.query;
            const skuInt = parseInt(sku);
            const unitValueFloat = parseFloat(unitValue)

            const productCreated = new Product({ productName, sku: skuInt, unitValue: unitValueFloat });
            
            const query = this.database.useInsertQuery('products', productCreated);
            
            await this.database.consultQuery(query);
            
            return rest.status(200).json({
                message: 'Success created user',
                user: productCreated,
            });
        } catch(err) {
            console.error(`[ERROR]:  ${ProductController.name} in method ${this.createProduct.name}\n${error}`);
            return rest.json({
                message: err,
            })
        }
    }
};
