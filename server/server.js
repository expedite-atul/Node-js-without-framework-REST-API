const http = require('http');


const hostname = 'localhost';
const port = 3000;

var body = {};
var idCounter = 3;
var db = [{
    "id": 1,
    "name": 'atul',
    "address": 'abcd',
    "mobile": 1234576890
},
{
    "id": 2,
    "name": 'atul',
    "address": 'abcd',
    "mobile": 124576890
}];

function queryExtractor(req, res) {
    req["query"] = {};
    let url = req.url;
    // console.log(req.url);
    let queryFields = (url.split("?")[1] || "").trim();
    req.url = url.split("?")[0];
    queryFields = queryFields.replace(/%20/g, " ")
    if (queryFields == "") {
        return
    }
    queryFields.split("&").forEach(element => {
        element = element.trim();
        if (element != "") {
            element = element.split("=");
            let e1 = element[0].trim();
            let e2 = element[1].trim();
            if (e1 != "") {
            req["query"][e1] = e2;
            }
        }

    });
    return;
}
function getUserInput(req, res) {
    res.writeHead(200, { "Content-type": "application/json" });
    res.write(JSON.stringify(req["query"]));
    res.end();
}




const server = http.createServer((req, res) => {
    queryExtractor(req);
    if (req.method === 'POST' && req.url === '/add') {
        let totalChunk = "";
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            totalChunk += chunk;
        }).on('end', () => {
            let parsedChunk = JSON.parse(totalChunk);
            let { mobile } = parsedChunk;

            let numberFound = false;
            // console.log("db: ", db);
            for (let i = 0; i < db.length; i++) {
                // console.log('test1', db[i].mobile); //test1 pass
                if (db[i].mobile === mobile) {
                    numberFound = true;
                    break;
                }
            }
            if (numberFound) {
                res.writeHead(400, { "Content-type": "application/json" });
                res.end(JSON.stringify({ "result": "failed number already exist!" }));
            } else {
                body = {
                    "id": idCounter++,
                    ...parsedChunk
                }
                db.push(body);
                res.writeHead(200, { "Content-type": "application/json" });
                res.end(JSON.stringify({ "result": "success" })); // pass
            }
        });
    }
    else if (req.method === 'GET' && req.url === '/get') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(db));  // pass
    }
    else if (req.method === 'GET' || req.url === "/getById") {
        let currentId = req["query"]["id"]
        let currName = req["query"]["name"];
        // let mobile = req["querry"]["mobile"];
        // console.log(currentId);
        db.forEach((element, i) => {
            console.log(i, element.id, currentId);
            if (currentId == element.id) {
                console.log("sdfgjhk"  +element.id);                
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({ "result": "address found","data":element}));
                return;
            }
            // res.writeHead(404, { "Content-type": "application/json" });
            // res.end(JSON.stringify({"result":"data not found"}));
        });
        // res.end(currentId);
    }
    else if (req.method === 'PUT' || req.url === "/updateById") {
        let updateId = req["query"]["id"];

        let totalChunk = "";
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            totalChunk += chunk;
        }).on('end', () => {
            let parsedChunk = JSON.parse(totalChunk);
            let { mobile } = parsedChunk;

            let numberFound = false;
            // console.log("db: ", db);
            for (let i = 0; i < db.length; i++) {
                // console.log('test1', db[i].mobile); //test1 pass
                if (db[i].mobile === mobile) {
                    numberFound = true;
                    break;
                }
            }
            if (numberFound) {
                res.writeHead(400, { "Content-type": "application/json" });
                res.end(JSON.stringify({ "result": "failed number already exist!" }));
            } else {
                body = {
                    "id": idCounter++,
                    ...parsedChunk
                }
                for (let i of db) {
                    if (i.id == updateId) {
                        i.name = body.name;
                        i.address = body.address;
                        i.mobile = body.mobile;
                        res.writeHead(200, { "Content-type": "application/json" });
                        res.end(JSON.stringify({ "result": "success", "updatedId": updateId })); // pass
                    } else {
                        res.statusCode = 404;
                        res.end('Not Found!!');
                    }
                }
            }
        });

    }
    else if (req.method === 'PATCH' && req.url === '/updateName') {
        let updateId = req["query"]["id"];

        let totalChunk = "";
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            totalChunk += chunk;
        }).on('end', () => {
            let parsedChunk = JSON.parse(totalChunk);
            let { mobile } = parsedChunk;

            let numberFound = false;
            // console.log("db: ", db);
            for (let i = 0; i < db.length; i++) {
                // console.log('test1', db[i].mobile); //test1 pass
                if (db[i].mobile === mobile) {
                    numberFound = true;
                    break;
                }
            }
            if (numberFound) {
                res.writeHead(400, { "Content-type": "application/json" });
                res.end(JSON.stringify({ "result": "failed number already exist!" }));
            } else {
                body = {
                    "id": idCounter++,
                    ...parsedChunk
                }
                for (let i of db) {
                    if (i.id == updateId) {
                        i.name = body.name;
                        // i.address = body.address;
                        // i.mobile = body.mobile;
                        res.writeHead(200, { "Content-type": "application/json" });
                        res.end(JSON.stringify({ "result": "success", "patchedId": updateId })); // pass
                    } else {
                        res.statusCode = 404;
                        res.end('Not Found!!');
                    }
                }
            }
        });
    }
    else if (req.method === 'DELETE' && req.url === '/deleteByid'){
        let deleteId = req["query"]["id"];
        console.log(deleteId);
        db.forEach((element ,index)=> {
            if(deleteId == element.id)
            {
                db.splice(index,1);
                console.log(element);
            }
        });
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({"response":"success","data":"runTimeDataFrom DB Deleted By Id","id":deleteId}));
    }
    else {
        res.statusCode = 404;
        res.end('Not Found!!');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at --> http://${hostname}:${port}`);
});