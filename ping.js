const axios = require('axios');

async function checkGoogle() {
    // 1. Record the exact time before we send the request
    const startTime = Date.now();
    
    try {
        await axios.get('https://www.google.com');
        
        // 2. Record the time after Google responds, and subtract the start time
        const responseTime = Date.now() - startTime;
        
        console.log(`Google is alive! Response time: ${responseTime}ms ✅`);
    } catch (error) {
        console.log("Google is down! ❌ Error:", error.message);
    }
}

setInterval(checkGoogle, 5000);
console.log("Uptime monitor with timer started... Press Control + C to stop.");