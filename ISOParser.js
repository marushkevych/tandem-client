var Dissolve = require("dissolve");

module.exports = function createParser(){
    
    var decoder = Dissolve().loop(function(end) {
        
        // first read header with length
        this.string('MTI', 4)
                .buffer('bitmap', 8)
                .string('7', 10)
                .string('11', 6)
                .string('12', 12)
                .string('24', 3)
                .string('42', 15)
                .string('length_48', 3)
                .tap(function() {
            
            // then read field 48
            
            this.string('48', parseInt(this.vars.length_48, 10))

        }).tap(function() {
            this.push(this.vars);
            this.vars = {};

        });
    });
    
    return decoder;
};

