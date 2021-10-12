const http = require('http');
const url = require('url');

const { parse } = require('querystring');
const { libNode } = require('@tonclient/lib-node')
const { TonClient } = require('@tonclient/core')

// Keys displayed by DeBot
const CLIENT_KEYS = {
    pub: '***',
    sec: '***',
}
const port = 8181
const parameterNamePost = 'param'

var fs = require('fs');
TonClient.useBinaryLibrary(libNode)
const client = TonClient.default

//
// The server's public key. WILL NOT be changed.
//
const SERVICE_KEYS = { pub: 'a36bf515ee8de6b79d30b294bbe7162f5e2a45b95ea97e4baebab8873492ee43' }


const main = async (KAFKA_MESSAGE) => {
    // Parse the message
    const [idempKey, nonceBase64, encrypted] = KAFKA_MESSAGE.split(' ')

    const { decrypted } = await client.crypto.nacl_box_open({
        encrypted,
        nonce: Buffer.from(nonceBase64, 'base64').toString('hex'),
        their_public: SERVICE_KEYS.pub,
        secret: CLIENT_KEYS.sec,
    })

    const base64ToUtf8 = (b) => Buffer.from(b, 'base64').toString('utf8')
    console.log(base64ToUtf8(decrypted))
    // process.exit(0)
}

var index = fs.readFileSync('robots.txt');

const requestListener = function (req, res) {

    if (req.url === '/help' && req.method === 'GET') {
        res.end('Welcome');
    }
    else if (req.url === '/robots.txt' && req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(index);
    }
    else if (req.method === 'GET') {
        let urlRequest = url.parse(req.url, true);
        res.end('ok');
    }
    else {
        // POST and etc
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            let params = parse(body);
            // console.log(params[parameterNamePost]);
            main(params[parameterNamePost]).catch(console.log)
            res.end('ok');
        });
    }
}

const server = http.createServer(requestListener);
server.listen(port);
console.log("http://127.0.0.1:8181/")
