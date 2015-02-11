
var client = require('../index').createClient();
client.connect(18889, 'localhost', function (err, connection) {

    if (err) {
        console.log('Can not connect to listener');
        process.exit(0);
    }

    connection.on('response', function (response) {
        console.log('response: ', JSON.stringify(response, null, 4));
    });

    connection.on('close', function () {
        console.log('Sorry connection is lost, exiting...');
        process.exit(0);
    });

    process.stdout.write("Client connected, please enter your request. Enter 'exit' to quit\n");

    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', function () {
        var chunk = process.stdin.read();
        if (chunk == null) {
            return;
        }
        chunk = chunk.trim();

        if (chunk == 'exit') {
            connection.end();
            process.exit(0);
        }

        connection.request(chunk);
    });

});