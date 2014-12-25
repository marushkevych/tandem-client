var net = require('net');
var Concentrate = require("concentrate");
var encoder = require('./encoder');
var createDecoder = require('./decoder');
 
var socket = new net.Socket();
socket.connect(8124, function() {
	console.log('Connected');
    
    var data = encoder.encode("Hello");

	socket.write(data);
});

var decoder = createDecoder();
 
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
        console.log('got respose', response);
    }
    
    socket.destroy();
});
