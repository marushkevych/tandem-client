/**
 * Usage:
 * this module exoprts connect function, which will notify the coller with connection object when connected.
 * 
 * Connection api:
 * - request(message, callback) - sends request and passes response to callback function
 *      
 * - end() - request connection to close (this will result in 'close' event, see below)
 * 
 * - emits 'close' event:
 * 
 * Example:
 * require('./Client').connect(port, host, function(connection) {
 *      connection.request("Hello", function(response){
 *          console.log('got response', response);
 *      });
 * 
 *      connection.on('close', function() {
 *          process.exit(0);
 *      });
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
        if(this.ended !== true)
            self.emit('close');
    });
    
}

Connection.prototype.request = function(message, callback) {
    this.socket.write(encoder.encode(message));
    var self = this;
    this.decoder.on("readable", function() {
        var response;
        while (response = self.decoder.read()) {
            callback(response);
        }
    });
};
Connection.prototype.end = function(){
    this.ended = true;
    this.socket.destroy();
};

