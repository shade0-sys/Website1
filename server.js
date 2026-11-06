app.get('/', (req, res, next) => {
    // 1. Check Render's 'x-forwarded-for' header first. 
    // This contains a list of IPs, with the very first one being the real visitor.
    const forwardedHeader = req.headers['x-forwarded-for'];
    let visitorIp;

    if (forwardedHeader) {
        // Split the comma-separated list and take the first IP
        visitorIp = forwardedHeader.split(',')[0].trim();
    } else {
        // Fallback if the header doesn't exist
        visitorIp = req.ip || req.socket.remoteAddress;
    }

    const timestamp = new Date().toISOString();
    const visitorName = req.query.name || 'Unknown Visitor';
    const logLine = `[${timestamp}] Name: ${visitorName} | Real IP: ${visitorIp}\n`;

    // Print to the Render dashboard terminal
    console.log(logLine);

    next();
});
