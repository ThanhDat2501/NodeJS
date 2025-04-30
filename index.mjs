import { createServer } from 'node:http';
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
const sum = '/sum';
const countSum = '/count-sum';
const currentTime = '/current-time';
const history = '/history';
let sumCallCount = 0;
let historyArray = [];
const server = createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json');
    if (request.method === post && request.url === sum) {
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
                    sumCallCount++;
                    historyArray.push({
                        endpoint: sum,
                        input: { number1, number2 },
                        output: result
                    });
                    response.end(JSON.stringify(result));
                    return;
                }
                sumCallCount++;
                const sum = number1 + number2;
                const result = { sum };
                historyArray.push({
                    endpoint: sum,
                    input: { number1, number2 },
                    output: result
                });
                response.statusCode = done;
                response.end(JSON.stringify(result));
            } catch (error) {
                const result = { error: errorJSON };
                response.statusCode = serverError;
                sumCallCount++;
                historyArray.push({
                    endpoint: sum,
                    input: {},
                    output: result
                });
                response.end(JSON.stringify(result));
            }
        });
    } else if (request.method === get && request.url === countSum) {
        const result = { totalCall: sumCallCount };
        response.statusCode = done;
        historyArray.push({
            endpoint: countSum,
            input: {},
            output: result
        });
        response.end(JSON.stringify(result));
    } else if (request.method === get && request.url === currentTime) {
        const currentTime = new Date().toISOString();
        const result = { currentTime };
        response.statusCode = done;
        historyArray.push({
            endpoint: currentTime,
            input: {},
            output: result
        });
        response.end(JSON.stringify(result));
    } else if (request.method === get && request.url === history) {
        response.statusCode = done;
        const result = { historyArray };
        response.end(JSON.stringify(result));
    } else {
        response.statusCode = notfound;
        response.end(JSON.stringify({ error: notfound }));
    }
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
