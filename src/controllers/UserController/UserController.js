const express = require('express');
const { User } = require('../../model');
const bcrypt = require('bcryptjs');

module.exports = class UserController {
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
    async getListUser(req, rest) {
        try {
            const query = this.database.useSelectQuery('usuarios');
            const data = await this.database.consultQuery(query);
    
            return rest.json({ data })
        } catch (err) {
            console.error(`[ERROR]:  ${UserController.name} in method ${this.getListUser.name}\n${err}`);

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
    async createUser(req, rest) {
        try {
            const { name, lastname, password, email, document } = req.query;
            
            const dateCreated = new Date().toISOString().split('T')[0];
            const cryptPassword = await this.crypt(password)

            const userCreated = new User({
                name,
                lastname,
                password: cryptPassword,
                email,
                document,
                dateCreated,
            });

            const query = this.database.useInsertQuery('usuarios', userCreated);
            await this.database.consultQuery(query);

            return rest.status(200).json({
                message: 'Success created user',
                user: userCreated,
            });
            
        } catch(error) {
            console.error(`[ERROR]:  ${UserController.name} in method ${this.createUser.name}\n${error}`);

            return rest.json({
                message: error,
            })
        }
    }

    /**
     * 
     * @param {string} text 
     * @returns 
     */
    async crypt(text) {
        try {
            const hash = await bcrypt.hash(text, 10);
            return hash;
        } catch (error) {
            console.error(`[ERROR]: ${ this.crypt.name }: ${error}`);
        }
    }
};
