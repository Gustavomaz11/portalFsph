import mysql from 'mysql2/promise';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config({path: '/var/www/app/.env'});

export default class {

    #conn = null;
    #database = null;

    constructor(database = null) {
        this.#database = database
    }

    async connect() {

        this.#conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: this.#database || process.env.DB_NAME,
            namedPlaceholders: true,
            connectTimeout: 3000,
            timezone: process.env.DB_TIMEZONE
        });
        
        void await this.#conn.connect()

    }

    get connection() {
        return this.#conn;
    }

    async begin() {
        if (this.#conn) void await this.#conn.beginTransaction();
    }

    async rollback() {
        if (this.#conn) void await this.#conn.rollback();
    }

    async commit() {
        if (this.#conn) void await this.#conn.commit();
    }

    async close() {
        if (this.#conn) void await this.#conn.end();
    }
    
}

export class sqlserver {

    static async connect(database) {

        const config = {
            "user": process.env.MS_USER, 
            "password": process.env.MS_PASS,
            "server": process.env.MS_HOST,
            "database": process.env.MS_DB,
            "options": {
                "encrypt": false
            }
        }

        void await sql.connect(config);

        return new sql.Request();
    }

    static async close() {
        void await sql.close();
    }

}
