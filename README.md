node-tcp-listener
=================
> TCP listener, provides message decoding and encoding using proprietary binary protocol. ```listener.createServer(processor)``` takes processor function that will be passed decoded message String and expected to return the response String.
Also a Client is provided for testing and simulation.

#### Install: 
```
npm install marushkevych/node-tcp-listener
```

#### Run Server:
```js
var listener = require('node-tcp-listener');

/**
 * Request processor function is injected into server to handle requests.
 *
 * @param {String} request
 * @returns {String} response
 */
function processor(request){
    // process the request and return String response
    return "Hello " + request;
}

var server = listener.createServer(processor);

server.listen(18888, localhost, function() {
    console.log('server bound');
});
```

#### Run Client:
```js
var listener = require('node-tcp-listener');
var client = listener.createClient();

client.connect(18888, 'localhost', function(connection) {

    // send request and recieve response
    connection.request("Hello", function(response){
        console.log('got response: ' + response);
        
        // disconnect
        connection.end();
    });
    
    // 'close' event - emitted if tcp connection was closed before connection.end() was called
    connection.on('close', function() {
        console.log('Sorry connection is lost, exiting...');
    });
});

```
also see examples folder for more client implementations

##### Client Connection API:
- ```Connection.request(message, callback)``` - sends request and passes response to callback function
- ```Connection.end()``` - request connection to close
- emits ```close``` event if tcp connection was closed before connection.end() was called


