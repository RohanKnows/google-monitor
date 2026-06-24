const sqlite3 = require('sqlite3').verbose();

// 1. Open a connection to our metrics database
const db = new sqlite3.Database('./metrics.db');

console.log("Fetching the latest 5 entries from the database...");

// 2. Query the last 5 records sorted by their unique ID
db.all("SELECT * FROM ping_logs ORDER BY id DESC LIMIT 5", [], (err, rows) => {
    if (err) {
        console.error("Error fetching data:", err.message);
        return;
    }
    // 3. Print the results out as a beautiful table
    console.table(rows);
    
    db.close();
});