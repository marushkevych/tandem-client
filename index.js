'use strict';
var net = require('net');
var createDecoder = require('./decoder');
var encoder = require('./encoder');

var server = net.createServer(function(socket) { //'connection' listener
    console.log('client connected');
    var decoder = createDecoder();

    socket.on('end', function() {
        console.log('client disconnected');
    });
    socket.on('data', function(data) {
        try {
            decoder.write(data);
        } catch (e) {
            console.log(e.message)
            socket.destroy();
        }
    });

    decoder.on("readable", function() {
        var request;

        while (request = decoder.read()) {
            console.log('got request', request);

            // process request

            // write response
            socket.write(encoder.encode("Goodbuy!"));
        }
    });

});
server.listen(8124, function() { //'listening' listener
    console.log('server bound');
});