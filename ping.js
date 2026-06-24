const axios = require('axios');

const websites = [
    'https://www.google.com',
    'https://www.github.com',
    'https://www.apple.com'
];

// This helper function handles a single website check
async function checkSingleSite(url) {
    const startTime = Date.now();
    try {
        await axios.get(url, { timeout: 5000 });
        const responseTime = Date.now() - startTime;
        console.log(`✅ ${url} is up! (${responseTime}ms)`);
    } catch (error) {
        console.log(`❌ ${url} is DOWN! Error: ${error.message}`);
    }
}

async function checkAllWebsitesConcurrent() {
    console.log(`--- Starting Fast Monitor Cycle: ${new Date().toLocaleTimeString()} ---`);
    
    // 1. Create a list of "promises" (tasks running at the same time)
    const tasks = websites.map(url => checkSingleSite(url));
    
    // 2. Fire them all simultaneously and wait for the entire batch to finish
    await Promise.all(tasks);
    
    console.log(`--- Cycle Finished ---`);
}

setInterval(checkAllWebsitesConcurrent, 10000);
checkAllWebsitesConcurrent();