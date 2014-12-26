var createClient = require('./tcpClient');

createClient(function(send){
    for(var i=0; i<10;i++){
        send('hello ' + i, function(response){
            console.log('main got responce', response);
        });
        
    }
})