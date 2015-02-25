'use strict';

var ISOMessageDecoder = require('./ISOMessageDecoder');
var LengthFieldDecoder = require('./LengthFieldDecoder');

/**
 * Combines LengthFieldDecoder and ISOMessageDecoder
 */
var MessageDecoder = module.exports = function(callback){

    var isoMessageDecoder = new ISOMessageDecoder(function(data){
        callback(data);
    });

    var lengthFieldDecoder = new LengthFieldDecoder(function(data){
        isoMessageDecoder.decode(data);
    });
    
    return {
        decode: function(data){
            lengthFieldDecoder.decode(data);
        }
    };

};