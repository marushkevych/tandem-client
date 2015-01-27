var Dissolve = require("dissolve");

module.exports = function createDecoder(){
    
    var decoder = Dissolve().loop(function(end) {
        
        // first read header with length
        this.int16be('header').tap(function() {
            
            // then read message
            console.log("got response length", this.vars.header);

            this.buffer("message", this.vars.header);

        }).tap(function() {
            this.push(this.vars.message);
            this.vars = {};

        });
    });
    
    return decoder;
};

