const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Trust proxy settings so cloud routing works properly
app.set('trust proxy', true);

// 2. The tracking route MUST come first to parse IP data securely
app.get('/', (req, res, next) => {
    const forwardedHeader = req.headers['x-forwarded-for'];
    let visitorIp;

    if (forwardedHeader) {
        // Split proxy hops and extract the user's authentic public IP
        visitorIp = forwardedHeader.split(',')[0].trim();
    } else {
        visitorIp = req.ip || req.socket.remoteAddress;
    }

    const timestamp = new Date().toISOString();
    const visitorName = req.query.name || 'Unknown Visitor';
    const logLine = `[${timestamp}] Name: ${visitorName} | Real IP: ${visitorIp}\n`;

    // This prints cleanly onto your Render Logs dashboard view
    console.log(logLine);

    // Pass control downstream to serve the actual folder files
    next();
});

// 3. Serve the physical website pages out of the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT}`);
});
