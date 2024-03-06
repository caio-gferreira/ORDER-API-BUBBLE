const express = require('express');

class AuthMiddleware {
    /**
     * @param {String} secretKey 
     */
    constructor(secretKey) {
        this.key = secretKey;
        this.authenticateApiKey = this.authenticateApiKey.bind(this);
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {Function} next
     */
    authenticateApiKey(req, res, next) {
        const apiKey = req.headers['authorization-key'];

        if (apiKey && apiKey === this.key) {
            return next();
        }

        return res.status(403).json({ message: 'Unauthorized' });
    }
}

module.exports = AuthMiddleware;
