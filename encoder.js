var Concentrate = require("concentrate");
var crc32 = require('buffer-crc32');

exports.encode = function(mti){
    
//    var body = Concentrate().string(message, "utf8").result();

    
    
    switch (mti){
           
        case '1804':
           return generate1804(); 
           
        default:
            return generate1604();
         
    }
    
};

function generate1604(){
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
            .string("0043", "ascii") // length of field 48
            .string("XXXXYYYYMMHHMMSSmm", "ascii") // loyalty-transaction-id
            .string("123", "ascii") // batch number
            .string("1234", "ascii") // ticket number
            .string("123456789012345678", "ascii") // GLG-record-key
            .result();
    
    var body = Concentrate().buffer(fixedFields).buffer(field48).result();
    
    
    var buf = Concentrate().int16be(body.length).buffer(body).result();
    console.log(buf);
    return buf;
}

function generate1804(){
    var bitMap = new Buffer("0220010000000000", "hex");
    
    var fixedFields = Concentrate()
            .string("1804", "ascii") // MTI
            .buffer(bitMap)
            .string("0220093326", "ascii") // field 7
            .string("332609", "ascii") // field 11
            .string("801", "ascii") // field 24
            .result();
    
    
    var buf = Concentrate().int16be(fixedFields.length).buffer(fixedFields).result();
    console.log(buf);
    return buf;
}
