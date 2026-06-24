const sqlite3 = require('sqlite3').verbose();

// 1. Create or open a database file named 'metrics.db'
const db = new sqlite3.Database('./metrics.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database. 🗄️");
    }
});

// 2. Create a table to store our ping logs
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS ping_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            status_code INTEGER,
            response_time_ms INTEGER,
            is_up INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Table 'ping_logs' is ready! ✅");
        }
    });
});

// Close the database connection when done setting up
db.close();