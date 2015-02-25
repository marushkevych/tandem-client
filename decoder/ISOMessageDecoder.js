'use strict';
var ISO1614MessageDecoder = require('./ISO1614MessageDecoder');
var ISO1814MessageDecoder = require('./ISO1814MessageDecoder');
/**
 * Delegate to 1614 decoder ot 1814 decoder
 */
var MessageDecoder = module.exports = function(callback){

    var iso1614MessageDecoder = new ISO1614MessageDecoder(function(data){
        callback(data);
    });

    var iso1814MessageDecoder = new ISO1814MessageDecoder(function(data){
        callback(data);
    });
    
    return {
        decode: function(data){
            if(data.toString('utf8', 0, 4) == '1814'){
                iso1814MessageDecoder.decode(data);
            }else{
                iso1614MessageDecoder.decode(data);
            }
        }
    };

};