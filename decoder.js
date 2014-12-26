var Dissolve = require("dissolve");
var crc32 = require('buffer-crc32');

module.exports = function createDecoder(){
    
    var decoder = Dissolve().loop(function(end) {
        
        // first read header and header checksum
        this.buffer('header', 24).uint32("checkSumHeader").tap(function() {
            
            // then check header checksum
            if (this.vars.checkSumHeader != crc32.unsigned(this.vars.header)) {
                console.log('provided header crc', this.vars.checkSumHeader);
                console.log('header crc', crc32.unsigned(this.vars.header));
                throw new Error('header checksum is invalid');
            }

            // then read message
            var dataLenght = this.vars.header.readUInt32LE(16);
            this.string("message", dataLenght);
        }).tap(function() {
            //  console.log('vars', this.vars)

            var dataCheckSum = this.vars.header.readUInt32LE(20);
            var message = this.vars.message;

            // check message checksum
            if (dataCheckSum != crc32.unsigned(message)) {
                console.log('provided message crc', dataCheckSum);
                console.log('message crc', crc32.unsigned(message));
                throw new Error('message checksum is invalid');
            }

            this.push(message);
            this.vars = {};

        });
    });
    
    return decoder;
};

