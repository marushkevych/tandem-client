/**
 * Usage:
 * this module exoprts connect function, which will notify the coller with Connection object when connected.
 * 
 * Connection api:
 * - connection.request(message) - sends request, and will emit 'response' event when response is received
 *      
 * - connection.end() - request connection to close
 * 
 * - emits 'response' event when response is received
 * 
 * - emits 'close' event if tcp connection was closed before connection.end() was called
 * 
 * Example:
 * require('./Client').connect(port, host, function(connection) {
 * 
 *      connection.on('response', function(response){
 *          console.log('got response', response);
 *      });
 * 
 *      connection.on('close', function() {
 *          process.exit(0);
 *      });
 *      
 *      connection.request("Hello");
 * 
 *      connection.end();
 * });
 * 
 */

var net = require('net');
var Concentrate = require("concentrate");
var encoder = require('./encoder');
var createDecoder = require('./decoder');

var util = require('util');
var EventEmitter = require('events').EventEmitter;


exports.connect = connect;

/**
 * 
 * @param {Number} port
 * @param {String} host
 * @param {Function} connectionListener
 * @returns {Connection}
 */
function connect(port, host, connectionListener) {
    var socket = new net.Socket();
    var decoder = createDecoder();

    socket.on('data', function(data) {
        try {
            decoder.write(data);
        } catch (e) {
            console.log("Decoding error, dropping connection", e.stack);
            socket.destroy();
        }
    });

    socket.connect(port, host, function() {
        console.log('Client Connected');
        connectionListener(new Connection(socket, decoder));
    });
}


/**
 * Class Connection extends  EventEmitter
 */
util.inherits(Connection, EventEmitter);
function Connection(socket, decoder){
    EventEmitter.call(this);
    this.socket = socket;
    this.decoder = decoder;
    var self = this;
    
    socket.on('close', function() {
        console.log('Client Disconnected');
        if(self.ended !== true)
            self.emit('close');
    });
    
    decoder.on("readable", function() {
        var response;
        while (response = decoder.read()) {
            self.emit('response', response);
        }
    });    
    
}

Connection.prototype.request = function(message) {
    this.socket.write(encoder.encode(message));
};
Connection.prototype.end = function(){
    this.ended = true;
    this.socket.destroy();
};

