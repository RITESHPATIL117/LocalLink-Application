const http = require('http');

const options = {
    hostname: '10.13.9.254',
    port: 3000,
    path: '/api/health',
    method: 'GET',
    timeout: 2000
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    process.exit(0);
});

req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
});

req.on('timeout', () => {
    console.error('TIMED OUT');
    req.destroy();
    process.exit(1);
});

req.end();
