const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // Render sets this dynamically

app.set('trust proxy', true);

// FIX: Put the tracking route FIRST before serving static files
app.get('/', (req, res, next) => {
    const visitorIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const timestamp = new Date().toISOString();
    const visitorName = req.query.name || 'Unknown Visitor';

    const logLine = `[${timestamp}] Name: ${visitorName} | IP: ${visitorIp}\n`;

    // This prints it directly into your Render Logs tab screen
    console.log(logLine);

    // This saves it to a file on Render's temporary server
    fs.appendFile(path.join(__dirname, 'log.txt'), logLine, (err) => {
        if (err) console.error('Error writing to log file', err);
    });

    // Move along to serve the page
    next();
});

// Serve the static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
