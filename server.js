const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./metrics.db');

const server = http.createServer((req, res) => {
    // Only handle the main home page URL
    if (req.url === '/' || req.url === '/index.html') {
        
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
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Database Error");
                return;
            }

            // Generate the HTML code dynamically using our database data
            let tableRows = '';
            rows.forEach(row => {
                tableRows += `
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd;">${row.url}</td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${row.total_checks}</td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center; color: #2ecc71; font-weight: bold;">${Math.round(row.average_latency_ms)}ms</td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center; color: #3498db; font-weight: bold;">${Math.round(row.uptime_percentage)}%</td>
                    </tr>
                `;
            });

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>System Monitor Dashboard</title>
                </head>
                <body style="font-family: Arial, sans-serif; margin: 40px; background-color: #f9f9f9; color: #333;">
                    <h1 style="color: #2c3e50;">🌐 Production Uptime Monitor</h1>
                    <p>Live status updates directly calculated from SQLite telemetry.</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <thead>
                            <tr style="background-color: #2c3e50; color: white; text-align: left;">
                                <th style="padding: 12px; border: 1px solid #ddd;">Website URL</th>
                                <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Total Pings</th>
                                <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Avg Latency</th>
                                <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Uptime Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Not Found");
    }
});

// Start the web server on Port 3000
// Use the cloud provider's port, or fall back to 3000 locally
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Web Server UI running on port ${PORT}`);
});