//=======[ Settings, Imports & Data ]==========================================

var mysql = require('mysql');
require('dotenv').config();
var connection = mysql.createConnection({
    host     : process.env.NODE_DB_HOST,
    port     : process.env.NODE_DB_PORT,
    user     : process.env.NODE_DB_USER,
    password : process.env.NODE_DB_PASS,
    database : process.env.NODE_DB_DATABASE
});

//=======[ Main module code ]==================================================

connection.connect(function(err) {
    if (err) {
        console.error('Error while connect to DB: ' + err.stack);
        return;
    }
    console.log('Connected to DB under thread ID: ' + connection.threadId);
});

module.exports = connection;

//=======[ End of file ]=======================================================
