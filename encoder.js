var Concentrate = require("concentrate");
var crc32 = require('buffer-crc32');

exports.encode = function(message){
    var header = Concentrate().string("POSLOYALTY", "utf8").buffer(new Buffer([0x00,0x00]))
            .uint32le(1).uint32le(message.length).uint32le(crc32.unsigned(message)).result();
    
    return Concentrate().buffer(header).uint32le(crc32.unsigned(header)).string(message, "utf8").result();
};

