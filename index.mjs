import { createServer } from 'node:http';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;
const done = 200;
const notfound = 404;
const serverError = 500;
const badRequest = 400;
const errorInput = "Invalid input";
const errorJSON = "Invalid JSON";
const post = 'POST';
const get = 'GET';
const sumUrl = '/sum';
const countSumUrl = '/count-sum';
const currentTimeUrl = '/current-time';
const historyUrl = '/history';
const DATA_FILE = 'data.json';
let items = [];
let countSum = 0;
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
const server = createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json');
    if (request.method === post && request.url === sumUrl) {
        let body = '';
        request.on('data', chunk => {
            body += chunk;
        });
        request.on('end', () => {
            try {
                const data = JSON.parse(body);
                const number1 = data.number1;
                const number2 = data.number2;
                if (typeof number1 !== 'number' || typeof number2 !== 'number') {
                    response.statusCode = badRequest;
                    const result = { error: errorInput };
                    countSum++;
                    items.push({
                        endpoint: sumUrl,
                        input: { number1, number2 },
                        output: result
                    });
                    response.end(JSON.stringify(result));
                    return;
                }
                countSum++;
                const sum = number1 + number2;
                const result = { sum };
                items.push({
                    endpoint: sumUrl,
                    input: { number1, number2 },
                    output: result
                });
                saveData()
                response.statusCode = done;
                response.end(JSON.stringify(result));
            } catch (error) {
                const result = { error: errorJSON };
                response.statusCode = serverError;
                countSum++;
                items.push({
                        endpoint: sumUrl,
                        input: {},
                        output: result
                    });
                saveData()
                response.end(JSON.stringify(result));
            }
        });
    } else if (request.method === get && request.url === countSumUrl) {
        const result = { totalCall: countSum };
        response.statusCode = done;
        items.push({
            endpoint: countSumUrl,
            input: {},
            output: result
        });
        saveData();
        response.end(JSON.stringify(result));
    } else if (request.method === get && request.url === currentTimeUrl) {
        const currentTime = new Date().toISOString();
        const result = { currentTime };
        response.statusCode = done;
        items.push({
            endpoint: currentTimeUrl,
            input: {},
            output: result
        });
        saveData()
        response.end(JSON.stringify(result));
    } else if (request.method === get && request.url === historyUrl) {
        response.statusCode = done;
        const result = { items };
        response.end(JSON.stringify(result));
    } else {
        response.statusCode = notfound;
        response.end(JSON.stringify({ error: notfound }));
    }
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
