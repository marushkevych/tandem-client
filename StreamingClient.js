var net = require('net');
var Concentrate = require("concentrate");
var encoder = require('./encoder');
var createDecoder = require('./decoder');

var util = require('util');
var Transform = require('stream').Transform;
util.inherits(StreamingClient, Transform);

exports.connect = connect;

function connect(connectionListener) {
    var socket = new net.Socket();
    var decoder = createDecoder();

    socket.on('data', function(data) {
        try {
            decoder.write(data);
        } catch (e) {
            console.log("Decoding error, dropping connection", e.message);
            socket.destroy();
        }
    });


    socket.connect(8124, function() {
        console.log('Client Connected');
        connectionListener(new StreamingClient(socket, decoder));
    });
}

/**
 * StreamingClient constuctor
 * @param {type} socket
 * @param {type} decoder - created with './decoder' factory
 * @returns {StreamingClient}
 */
function StreamingClient(socket, decoder) {
    if (!(this instanceof StreamingClient))
        return new StreamingClient();

    Transform.call(this);
    this.setEncoding('utf8');
    this.socket = socket;
    var self = this;

    decoder.on("readable", function() {
        var response;
        while (response = decoder.read()) {
            self.push(response);
        }
    });

    socket.on('close', function() {
        console.log('Client Disconnected');
        self.emit('close');
    });
    
    this.on('end', function() {
        console.log('Closing socket');
        socket.destroy();
    });
}

StreamingClient.prototype._transform = function _transform(message, encoding, done) {
    this.socket.write(encoder.encode(message));
    done();
};

