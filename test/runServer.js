var listener = require('../index');
var server = listener.createServer();

server.listen(18888, function() { //'listening' listener
    console.log('server bound');
});