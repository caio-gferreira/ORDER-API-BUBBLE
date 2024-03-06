const mysql = require('mysql');
const { Database } = require('../config')

module.exports = class SqlDatabse {
    constructor() {
        /**@private */
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'bubble_papelaria',
        });
    }

    connectDatabase() {
        this.connection.connect((err) => {
            if (err) {
              console.error('Erro ao conectar ao banco de dados:', err);
              return;
            }
            console.log('Conexão bem sucedida ao banco de dados MySQL!');
          });
    }

    /**
     * 
     * @param {string} queryString 
     * @returns {Promise} Need resolve promise
     */
    async consultQuery(queryString) {
        return new Promise((resolve, reject) => {
            this.connection.query(queryString, (error, results, fields) => {
                if (error) {
                    console.error(`[ERROR]: ${ this.consultQuery.name } ${ error }`);
                    reject(error);
                } else {
                    console.log('Success request database!', results);
                    resolve(results);
                }
            });
        });
    } 
    useInsertQuery(tableName, data) {
        const fields = Object.keys(data).join(', ');
        const values = Object.values(data).map(value => typeof value === 'string' ? `'${value}'` : value).join(', ');
    
        return `INSERT INTO ${tableName} (${fields}) VALUES (${values})`;
    }
    
    /**
     * 
     * @param {string} tableName 
     * @returns {string}
     */
    useSelectQuery(tableName) {
        return `SELECT * FROM ${ tableName }`;
    }
    /**
     * 
     * @param {string[]} tables 
     * @param {string[]} conditions 
     * @returns 
     */
    useRelationshipSelectQuery(tables, conditions) {
        let queryString = `SELECT * FROM ${tables[0]}`;
    
        for (let i = 1; i < tables.length; i++) {
            queryString += ` INNER JOIN ${tables[i]} ON ${conditions[i - 1]}`;
        }
    
        return queryString;
    }

    useSelectQueryByField(tableName, field, value) {
        return `SELECT * FROM ${tableName} WHERE ${field} = ${value};`
    }
};
