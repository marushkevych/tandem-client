var PosClient = require('./PosClient');

PosClient.connect(function(stream){
    stream.on('readable', function(){
        var response;
        while (response = stream.read()) {
            console.log("main got response", response)
        }
    });
    
    stream.on('close', function() {
        console.log('Client closed');
    });
    
    
    for(var i=0; i<10;i++){
        stream.write("hello" + i);
    }
    
        
});