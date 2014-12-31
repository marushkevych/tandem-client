
var client = require('../index').createClient();
client.connect(18888, 'localhost', function(connection) {
    
    connection.on('response', function(response) {
        process.stdout.write('response: ' + response + '\n');
    });

    connection.on('close', function() {
        console.log('Sorry connection is lost, exiting...');
        process.exit(0);
    });
    
    process.stdout.write("Client connected, please enter your request. Enter 'exit' to quit\n");
    
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('readable', function() {
        var chunk = process.stdin.read();
        if (chunk == null) {
            return;
        }
        chunk = chunk.trim();

        if(chunk == 'exit'){
            connection.end();
            process.exit(0);
        }

        connection.request(chunk);
    });

});