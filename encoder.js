var Concentrate = require("concentrate");
var crc32 = require('buffer-crc32');

exports.encode = function(message){
    
//    var body = Concentrate().string(message, "utf8").result();

    var bitMap = new Buffer("0230010000410000", "hex");
    
    var fixedFields = Concentrate()
            .string("1604", "ascii") // MTI
            .buffer(bitMap)
            .string("MMDDhhmmss", "ascii") // field 7
            .string("999999", "ascii") // field 11
            .string("YYMMDDhhmmss", "ascii") // field 12
            .string("641", "ascii") // field 24
            .string("CARD_ACCEPTOR_1", "ascii") // field 42
            .result();
    
    var field48 = Concentrate()
            .string("043", "ascii") // length
            .string("XXXXYYYYMMHHMMSSmm", "ascii") // loyalty-transaction-id
            .string("123", "ascii") // batch number
            .string("1234", "ascii") // ticket number
            .string("123456789012345678", "ascii") // GLG-record-key
            .result();
    
    var body = Concentrate().buffer(fixedFields).buffer(field48).result();
    
    
    var buf = Concentrate().int16be(body.length).buffer(body).result();
    console.log(buf);
    return buf;
};

