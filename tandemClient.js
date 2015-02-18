
var client = require('./index').createClient();
var prompt = "please enter loyalty-transaction-id in the format: XXXXYYYYMMHHMMSSmm: "
if(process.argv.length < 4){
    console.log('Please provide host and port: node tandemClient.js host port')
    process.exit(0);
}

var host = process.argv[2];
var port = process.argv[3];
client.connect(port, host, function (err, connection) {

    if (err) {
        console.log('Can not connect to listener');
        process.exit(0);
    }

    connection.on('response', function (response) {
        console.log('response: ', JSON.stringify(response, null, 4));
        process.stdout.write(prompt);
    });

    connection.on('close', function () {
        console.log('Sorry connection is lost, exiting...');
        process.exit(0);
    });

    console.log("Client connected", prompt);

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
        
        if(chunk.trim().length != 18){
            console.log('invalid loyalty-transaction-id')
            console.log(prompt);
            return;
        }

        connection.request(chunk);
    });

});