require('dotenv').config();
const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl 
    ? new Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: { timestamps: false }
    })
    : new Sequelize({
        dialect: 'sqlite',
        storage: './exam_system.db',
        logging: false,
        define: { timestamps: false }
    });

module.exports = sequelize;
