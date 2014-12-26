
require('./Client').connect(function(connection) {

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
            return;
        }

        connection.request(chunk, function(response){
            process.stdout.write('response: ' + response + '\n');
        });
    });


    connection.on('close', function() {
        console.log('Client closed');
        process.exit(0);
    });

});