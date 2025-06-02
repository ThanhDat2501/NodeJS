import { error } from "console";
import { createRequire } from "module";
import { createServer, request } from 'node:http';
const require = createRequire(import.meta.url);
const hostname = '127.0.0.1';
const port = 3000;
// const fs = require('fs')
// const readfile=fs.readFileSync('file.txt',"utf-8",(error,data) =>{
//     if(error){
//         console.log(error)
//     }else{
//         console.log(data)
//     }
// }
// )
// console.log(readfile)
// const server=createServer((request,response) =>{
//     fs.readFile('file.txt', function(err, data) {
//     response.writeHead(200, {'Content-Type': 'application/json'});
//     let body = '';
//         request.on('data', chunk => {
//             body += chunk;
//         });
//     response.write(data);
//     response.write(typeof(data))
//     return response.end();
// })
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });








import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





import path from 'path';
const http = require('http');
const fs = require('fs');
// const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// Load data from file or initialize empty array
let items = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    items = JSON.parse(data);
  }
} catch (err) {
  console.error('Failed to load data:', err);
  items = [];
}

// Utility to save data to file
function saveData() {
  fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), (err) => {
    if (err) console.error('Error saving data:', err);
  });
}

// Create server
const server = http.createServer((req, res) => {
  if (req.url === '/items' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(items));
  }

  else if (req.url === '/items' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newItem = JSON.parse(body);
        items.push(newItem);
        saveData();
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newItem));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
