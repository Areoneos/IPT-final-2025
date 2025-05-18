const mysql = require('mysql2/promise');
const config = require('./config.json');

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database
        });

        console.log('Successfully connected to MySQL database!');
        
        // Test a simple query
        const [rows] = await connection.query('SELECT 1 as test');
        console.log('Query test result:', rows);

        await connection.end();
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
    }
}

testConnection(); 