#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 5000;

const server = http.createServer((req, res) => {
  // Serve the HTML file
  const filePath = path.join(__dirname, 'public', 'index.html');
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading the page');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`NoteBlue app is running on http://localhost:${PORT}`);
});
