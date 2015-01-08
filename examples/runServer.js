var listener = require('../index');
var Q = require('q');

// this processor will echo requests
function echo(request){
    return Q.promise(function(resolve,reject){
        if(request === 'error'){
            reject('invalid request')
            return;
        }
        resolve(request);
    });
}

var server = listener.createServer(echo);

server.listen(18888, 'localhost', function() { //'listening' listener
    console.log('server bound');
});