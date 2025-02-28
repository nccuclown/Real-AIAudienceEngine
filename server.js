
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Create HTTP server
const server = http.createServer((req, res) => {
  // Handle simple static file serving for development
  let filePath = './public' + req.url;
  if (req.url === '/') {
    filePath = './public/index.html';
  }

  // Get the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Create WebSocket server
const wss = new WebSocket.Server({ 
  server,
  path: '/ws',  // Specify the path explicitly
  clientTracking: true,
  // 增加ping-pong保持连接活跃
  pingInterval: 30000,
  pingTimeout: 5000
});

// Store connected clients
const clients = new Set();

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`Client connected from ${clientIp}`);
  clients.add(ws);
  
  // Send initial connection confirmation
  try {
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to WebSocket server',
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error sending initial message:', error);
  }
  
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
    try {
      // Parse the message
      const data = JSON.parse(message);
      
      // Handle different message types
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
          
        case 'broadcast':
          // Broadcast to all clients
          for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'broadcast',
                message: data.message,
                sender: data.sender || 'anonymous'
              }));
            }
          }
          break;
          
        default:
          // Echo the message back for other types
          ws.send(JSON.stringify({
            type: 'echo',
            originalMessage: data,
            timestamp: Date.now()
          }));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid JSON format'
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
  console.log(`WebSocket server available at ws://0.0.0.0:${PORT}/ws`);
});
