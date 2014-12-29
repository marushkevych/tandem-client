var server = require('../index').createServer();

server.listen(18888, function() { //'listening' listener
    console.log('server bound');
});