require('dotenv').config();
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASS || null; // Handle empty password
    const database = process.env.DB_NAME;

    try {
        // Create DB if it doesn't exist
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);

        // Connect to DB
        const sequelize = new Sequelize(database, user, password, {
            host,
            dialect: 'mysql',
            logging: false,
            define: {
                // Ensure consistent table naming
                freezeTableName: true,
                // Use snake_case for column names
                underscored: true,
                // Use the same case for all table names
                tableName: true
            }
        });

        // Initialize models in correct order
        db.Account = require('../accounts/account.model')(sequelize);
        db.RefreshToken = require('../accounts/refresh-token.model.js')(sequelize);
        db.Department = require('../departments/department.model')(sequelize, Sequelize);
        db.Employee = require('../employees/employee.model')(sequelize, Sequelize);
        db.Request = require('../requests/request.model')(sequelize, Sequelize);
        db.RequestItem = require('../requests/request-item.model')(sequelize, Sequelize);

        // Define relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);
        
        // Employee relationships
        db.Employee.belongsTo(db.Account, { 
            foreignKey: 'userId', 
            as: 'user',
            onDelete: 'CASCADE'
        });
        db.Employee.belongsTo(db.Department, { 
            foreignKey: 'departmentId', 
            as: 'department',
            onDelete: 'CASCADE'
        });
        
        // Request relationships
        db.Request.belongsTo(db.Employee, {
            foreignKey: 'employeeId',
            as: 'employee',
            onDelete: 'CASCADE'
        });
        db.Request.hasMany(db.RequestItem, {
            foreignKey: 'requestId',
            as: 'requestItems',
            onDelete: 'CASCADE'
        });
        
        // Initialize model associations
        Object.keys(db).forEach(modelName => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });

        // Drop all tables and recreate them
        await sequelize.sync({ force: true });

        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        if (error.original) {
            console.error('Original error:', error.original);
        }
    }
}