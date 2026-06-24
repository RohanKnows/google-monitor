const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./metrics.db');

console.log("--- System Analytics Dashboard ---");

const query = `
    SELECT 
        url,
        COUNT(*) as total_checks,
        AVG(response_time_ms) as average_latency_ms,
        (SUM(is_up) * 100.0 / COUNT(*)) as uptime_percentage
    FROM ping_logs
    GROUP BY url
`;

db.all(query, [], (err, rows) => {
    if (err) {
        console.error("Error calculating analytics:", err.message);
        return;
    }
    console.table(rows);
    db.close();
});