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
var createISOParser = require('./ISOParser');

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
    var ISOParser = createISOParser();

    socket.on('data', function (data) {
        try {
            ISOParser.write(data);
        } catch (e) {
            console.log("Decoding error, dropping connection", e.stack);
            socket.destroy();
        }
    });

    socket.on('error', function (error) {
        connectionListener(error);
    });

    socket.connect(port, host, function () {
        console.log('Client Connected');
        connectionListener(null, new Connection(socket, ISOParser));
    });
}


/**
 * Class Connection extends  EventEmitter
 */
util.inherits(Connection, EventEmitter);
function Connection(socket, ISOParser) {
    EventEmitter.call(this);
    this.socket = socket;
    this.ISOParser = ISOParser;
    var self = this;

    socket.on('close', function () {
        console.log('Client Disconnected');
        if (self.ended !== true)
            self.emit('close');
    });

    ISOParser.on("readable", function () {
        var response;
        while (response = ISOParser.read()) {
//            console.log(response)
//            self.emit('response', response['48']);
            self.emit('response', response);
        }
    });

}

Connection.prototype.request = function (message, callback) {
    this.socket.write(encoder.encode(message), null, function () {
        if (callback)
            callback();
    });
};
Connection.prototype.end = function () {
    this.ended = true;
    this.socket.destroy();
};

