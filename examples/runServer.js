var listener = require('../index');

// this processor will echo requests
function echo(request, responseListener){
    responseListener(request);
}

var server = listener.createServer(echo);

server.listen(18888, 'localhost', function() { //'listening' listener
    console.log('server bound');
});