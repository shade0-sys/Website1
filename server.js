const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Trust proxy headers for deployment platforms
app.set('trust proxy', true);

// Tell Express to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Log the IP and then serve the HTML file
app.get('/', (req, res) => {
    const visitorIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const timestamp = new Date().toISOString();
    const visitorName = req.query.name || 'Unknown Visitor';

    const logLine = `[${timestamp}] Name: ${visitorName} | IP: ${visitorIp}\n`;

    fs.appendFile(path.join(__dirname, 'log.txt'), logLine, (err) => {
        if (err) console.error('Error writing to log file', err);
    });

    // Send the index.html file to the browser
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
