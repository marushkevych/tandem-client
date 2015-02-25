'use strict';
var net = require('net');
var createDecoder = require('./decoder/MessageDecoder');
var encoder = require('./encoder');
var Q = require('q');

module.exports = createServer;
        
function createServer(process){
    // default request processor will echo the request
    process = process || function(request){return request};
    
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
                console.log("Dropping connection, decoding error:", e);
                socket.destroy();
            }
        });

        decoder.on("readable", function() {
            var request;
            while (request = decoder.read()) {
                console.log('got request', request);

                // process request
                Q.when(process(request), function(response){
                    // write response
                    if(response){
                        socket.write(encoder.encode(response));
                    }else{
                        console.log('no response')
                    }
                }, function(error){
                    console.log("Dropping connection, processing error:", error);
                    socket.destroy();              
                });
            }
        });

    });   
    
    server.on('error', function(e) {
        if (e.code == 'EADDRINUSE') 
        {
            console.log('Address in use, exiting...');
        }
        else
        {
            console.log("Ooops! Server exiting due to an error:", e);
        }
    });    
    
    server.on('listening', function() {
        console.log('Listening on', server.address());
    });     
    
    return server;
};



