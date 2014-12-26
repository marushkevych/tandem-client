var StreamingClient = require('./StreamingClient');

StreamingClient.connect(function(stream) {

    process.stdout.write("Client connected, please enter your request. Enter 'exit' to quit\n");

    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', function() {
        var chunk = process.stdin.read();
        if (chunk == null) {
            return;
        }
        chunk = chunk.trim();
        if(chunk == 'exit'){
            stream.end(null, null, function(){
                process.exit(0);
            });
            return;
        }
        stream.write(chunk);
    });

    process.stdin.on('end', function() {
        process.stdout.write('end\n');
        stream.end();
    });



    stream.on('readable', function() {
        var response;
        while (response = stream.read()) {
            process.stdout.write('response: ' + response + '\n');
        }
    });

    stream.on('close', function() {
        console.log('Client closed');
    });

});