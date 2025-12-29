if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

require('pg');

const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

if (!global._sequelize) {
  global._sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: { timestamps: false },
  });
}

module.exports = global._sequelize;
