
var encoder = require('./encoder');
var request = require('request');
var ISOMessageDecoder = require('./decoder/ISOMessageDecoder');

var isoMessageDecoder = new ISOMessageDecoder(function(data){
    console.log(JSON.stringify(data, null, 4));
    console.log(prompt);
});

var prompt = "please enter 4 digit Message Type Indicator (1604 or 1804)";
if(process.argv.length < 4){
    console.log('Please provide host and port: node tandemClient.js host port')
    process.exit(0);
}

var host = process.argv[2];
var port = process.argv[3];

console.log(prompt);

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function () {
    var chunk = process.stdin.read();
    if (chunk == null) {
        return;
    }
    chunk = chunk.trim();

    if (chunk == 'exit') {
        process.exit(0);
    }

//        if(chunk.trim().length != 18){
//            console.log('invalid loyalty-transaction-id')
//            console.log(prompt);
//            return;
//        }

    // remove two leadeing bytes - length header
    var requestBytes = encoder.encode(chunk).slice(2);

    request.post({
        uri: "http://"+host+":"+port+"/tandem",
        body: requestBytes,
        encoding: null // return Buffer
    },
    function (error, response, body) {
        
        if(error){
            console.log('error: ', error);
            return;
        }
        
        if (response.statusCode != 200) {
            console.log('error: ', response.statusCode);
        }
        
        console.log("got buffer:",Buffer.isBuffer(body));
        console.log("got response",body);
        isoMessageDecoder.decode(body);
  
    });
});




