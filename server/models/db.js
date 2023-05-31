async function connect() {
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: '',
        database: 'livechat'
    });

    global.connection = connection;
    return connection;
}

module.exports = {connect}