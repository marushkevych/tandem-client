var net = require('net');
var Concentrate = require("concentrate");
var encoder = require('./encoder');
var createDecoder = require('./decoder');
 
module.exports = function create(connectionListener){ 
    
    var socket = new net.Socket();
    var decoder = createDecoder();
    var responseListener;
    
    function send(message, callback){
        responseListener = callback;
        socket.write(encoder.encode(message));
    }
    
    
    socket.connect(8124, function() {
        console.log('Connected');
        connectionListener(send);
    });


    socket.on('data', function(data) {
        try {
            decoder.write(data);
        } catch (e) {
            console.log(e.message)
            socket.destroy();
        }
    });

    socket.on('close', function() {
        console.log('Connection closed');
    });

    decoder.on("readable", function() {
        var response;

        while (response = decoder.read()) {
            responseListener(response);
        }

    });
};
