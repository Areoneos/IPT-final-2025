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
            logging: false
        });

        // Initialize models
        db.Account = require('../accounts/account.model')(sequelize);
        db.RefreshToken = require('../accounts/refresh-token.model.js')(sequelize);
        db.Employee = require('../employees/employee.model')(sequelize, Sequelize);
        db.Department = require('../departments/department.model')(sequelize, Sequelize);
        db.Request = require('../requests/request.model')(sequelize, Sequelize);
        db.RequestItem = require('../requests/request-item.model')(sequelize, Sequelize);

        // Define relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);
        db.Employee.belongsTo(db.Account, { foreignKey: 'userId', as: 'user' });
        db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'department' });
        
        // Initialize model associations
        Object.keys(db).forEach(modelName => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });

        // Sync models
        await sequelize.sync({ alter: true });

        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}