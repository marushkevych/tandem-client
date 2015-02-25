var Dissolve = require("dissolve");

function createParser(){
    
    var decoder = Dissolve().loop(function(end) {
        
        this.tap('isoMessage', function(){
            this.string('MTI', 4)
                    .buffer('bitmap', 8)
                    .string('dateAndTime', 10)
                    .string('traceNumber', 6)
                    .string('functionCode', 3)
                    .string('actionCode', 3);

            this.tap(function() {
                this.push(this.vars.isoMessage);
                this.vars = {};

            });
        });
    });
    
    return decoder;
};



// constructor function
var ISO1814MessageDecoder = module.exports = function(callback){
    var parser = createParser();
    
    parser.on("readable", function () {
        var response;
        while (response = parser.read()) {
            callback(response);
        }
    });
    
    return {
        decode: function(data){
            parser.write(data);
        }
    }
    
};