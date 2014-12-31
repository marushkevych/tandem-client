var listener = require('pcats-listener');
var client = listener.createClient();

/**
 * Connect middleware, will proxy http request payload to tcp listener
 * 
 * @param {type} req
 * @param {type} res
 * @param {type} next
 */
module.exports = function(req, res, next) {
    if (req.method === 'POST' && req.url === '/tcp-proxy') {
        //console.log('proxy', req.headers)

        var body = '';
        req.on('data', function(chunk) {
            body += chunk;
        })

        req.on('end', function() {
            // process request
            client.connect(18888, 'localhost', function(connection) {
                
                connection.on('response', function(response) {
                    console.log('got response', response);
                    res.write(response);
                    res.end();
                    connection.end();
                });

                connection.on('close', function(){
                    console.log("Server dropped connection")
                    res.statusCode = 400;
                    return res.end("Server dropped connection");
                });
                
                connection.request(body);
            });

        });

    } else {
        return next();
    }
};



