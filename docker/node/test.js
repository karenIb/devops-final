const axios = require('axios');

async function runTest() {
    const url = 'http://web:80/';
    const expected = 'Karen';

    console.log(`Testing URL: ${url}`);

    try {
        const response = await axios.get(url);
        const data = response.data;

        console.log(`Received: "${data}"`);

        // Check if the response matches "Hello world"
        // Trimming to handle potential whitespace
        if (String(data).trim() === expected) {
            console.log('Test PASSED');
            process.exit(0);
        } else {
            console.error(`Test FAILED: Expected "${expected}", but got "${data}"`);
            process.exit(1);
        }
    } catch (error) {
        console.error(`Test FAILED: Error connecting to ${url}`);
        console.error(error.message);
        process.exit(1);
    }
}

// Wait for a few seconds to let services start up completely, although depends_on handles order, applications might take time to listen
console.log('Waiting 10 seconds for services to stabilize...');
setTimeout(runTest, 10000);
