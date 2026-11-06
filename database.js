const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yasmin14",
    database: "book_management"
});

db.connect((err) => {
    if (err) {
        console.log("Database Error:", err.message);
        return;
    }

    console.log("MySQL Connected Successfully!");
});

module.exports = db;