'use strict';

var Dissolve = require("dissolve");

function createParser(){
    
    var decoder = Dissolve().loop(function(end) {
        
        // first read header with length
        this.int16be('header').tap(function() {
            console.log("got header with length", this.vars.header);
            this.buffer('isoMessage', this.vars.header)
            this.tap(function() {
                this.push(this.vars.isoMessage);
                this.vars = {};

            });
        });
    });
    
    return decoder;
};

// constructor function
var LengthFieldDecoder = module.exports = function(callback){
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