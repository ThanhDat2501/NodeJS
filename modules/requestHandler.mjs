import { createServer } from 'node:http';
import { createRequire } from "module";
import { https, endpoint, https_status, header, data_file, type, input_status } from './constants.mjs';
const require = createRequire(import.meta.url);
const fs = require('fs');
let items = [];
let countSum = 0;
try {
    if (fs.existsSync(data_file)) {
        const data = fs.readFileSync(data_file, 'utf-8');
        items = JSON.parse(data);
        countSum += items.length
    }
} catch (err) {
    console.error('Failed to load data:', err);
    items = [];
}
function saveData() {
    fs.writeFile(data_file, JSON.stringify(items, null, 2), (err) => {
        if (err) console.error('Error saving data:', err);
    });
}
// export const server = createServer((request, response) => {
//     response.setHeader(header.CONTENT_TYPE, type.JSON);
//     if (request.method === https.POST && request.url === endpoint.sumUrl) {
//         let body = '';
//         request.on('data', chunk => {
//             body += chunk;
//         });
//         request.on('end', () => {
//             try {
//                 const data = JSON.parse(body);
//                 const number1 = data.number1;
//                 const number2 = data.number2;
//                 if (typeof number1 !== 'number' || typeof number2 !== 'number') {
//                     response.statusCode = https_status.badRequest;
//                     const result = { error: input_status.errorInput };
//                     countSum++;
//                     items.push({
//                         endpoint: endpoint.sumUrl,
//                         input: { number1, number2 },
//                         output: result
//                     });
//                     response.end(JSON.stringify(result));
//                     saveData()
//                     return;
//                 }
//                 countSum++;
//                 const sum = number1 + number2;
//                 const result = { sum };
//                 items.push({
//                     endpoint: endpoint.sumUrl,
//                     input: { number1, number2 },
//                     output: result
//                 });
//                 saveData()
//                 response.statusCode = https_status.oke;
//                 response.end(JSON.stringify(result));
//             } catch (error) {
//                 const result = { error: input_status.errorJSON };
//                 response.statusCode = https_status.serverError;
//                 countSum++;
//                 items.push({
//                     endpoint: endpoint.sumUrl,
//                     input: {},
//                     output: result
//                 });
//                 saveData()
//                 response.end(JSON.stringify(result));
//             }
//         });
//     } else if (request.method === https.GET && request.url === endpoint.countSumUrl) {
//         countSum++;
//         const result = { totalCall: countSum };
//         response.statusCode = https_status.oke;
//         items.push({
//             endpoint: endpoint.countSumUrl,
//             input: {},
//             output: result
//         });
//         saveData();
//         response.end(JSON.stringify(result));
//     } else if (request.method === https.GET && request.url === endpoint.currentTimeUrl) {
//         const currentTime = new Date().toISOString();
//         const result = { currentTime };
//         response.statusCode = https_status.oke;
//         items.push({
//             endpoint: endpoint.currentTimeUrl,
//             input: {},
//             output: result
//         });
//         saveData()
//         response.end(JSON.stringify(result));
//     } else if (request.method === https.GET && request.url === endpoint.historyUrl) {
//         response.statusCode = https_status.oke;
//         const result = { items };
//         response.end(JSON.stringify(result));
//     } else {
//         response.statusCode = https_status.notfound;
//         response.end(JSON.stringify({ error: https_status.notfound }));
//     }
// });

export function handleSumRequest(request, response) {
    response.setHeader(header.CONTENT_TYPE, type.JSON);
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
                response.statusCode = https_status.badRequest;
                const result = { error: input_status.errorInput };
                countSum++;
                items.push({
                    endpoint: endpoint.sumUrl,
                    input: { number1, number2 },
                    output: result
                });
                response.end(JSON.stringify(result));
                saveData()
                return;
            }
            countSum++;
            const sum = number1 + number2;
            const result = { sum };
            items.push({
                endpoint: endpoint.sumUrl,
                input: { number1, number2 },
                output: result
            });
            saveData()
            response.statusCode = https_status.oke;
            response.end(JSON.stringify(result));
        } catch (error) {
            const result = { error: input_status.errorJSON };
            response.statusCode = https_status.serverError;
            countSum++;
            items.push({
                endpoint: endpoint.sumUrl,
                input: {},
                output: result
            });
            saveData()
            response.end(JSON.stringify(result));
        }
    });
}

export function handleCountRequest(request, response) {
    countSum++;
    const result = { totalCall: countSum };
    response.statusCode = https_status.oke;
    items.push({
        endpoint: endpoint.countSumUrl,
        input: {},
        output: result
    });
    saveData();
    response.end(JSON.stringify(result));
}

export function handleTimeRequest(request, response) {
    const currentTime = new Date().toISOString();
    const result = { currentTime };
    response.statusCode = https_status.oke;
    items.push({
        endpoint: endpoint.currentTimeUrl,
        input: {},
        output: result
    });
    saveData()
    response.end(JSON.stringify(result));
}
export function handleHistoryRequest(request, response) {
    response.statusCode = https_status.oke;
    const result = { items };
    response.end(JSON.stringify(result));
}