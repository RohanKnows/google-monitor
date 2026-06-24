const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const websites = [
    'https://www.google.com',
    'https://www.github.com',
    'https://www.apple.com'
];

// Open our database connection
const db = new sqlite3.Database('./metrics.db');

// This helper function handles a single website check AND saves it to the DB
async function checkSingleSite(url) {
    const startTime = Date.now();
    let statusCode = null;
    let responseTimeMs = null;
    let isUp = 0; // 0 means down, 1 means up

    try {
        const response = await axios.get(url, { timeout: 5000 });
        statusCode = response.status;
        responseTimeMs = Date.now() - startTime;
        isUp = 1; 
        console.log(`✅ ${url} is up! (${responseTimeMs}ms)`);
    } catch (error) {
        responseTimeMs = Date.now() - startTime;
        if (error.response) {
            statusCode = error.response.status;
        }
        console.log(`❌ ${url} is DOWN! Error: ${error.message}`);
    }

    // Insert the results into our SQLite database
    const query = `INSERT INTO ping_logs (url, status_code, response_time_ms, is_up) VALUES (?, ?, ?, ?)`;
    db.run(query, [url, statusCode, responseTimeMs, isUp], (err) => {
        if (err) {
            console.error("Failed to save log to database:", err.message);
        }
    });
}

async function checkAllWebsitesConcurrent() {
    console.log(`\n--- Starting Monitor Cycle: ${new Date().toLocaleTimeString()} ---`);
    const tasks = websites.map(url => checkSingleSite(url));
    await Promise.all(tasks);
}

// Run the checks every 10 seconds
setInterval(checkAllWebsitesConcurrent, 10000);
checkAllWebsitesConcurrent();