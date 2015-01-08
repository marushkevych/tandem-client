pcats-listener
=================
> TCP listener, provides message decoding and encoding using proprietary binary protocol.

> Request processor function is injected into server to handle requests: ```listener.createServer(processor)``` 
Processor function will be called with decoded request String and expected to return the response String or response Promise. If no response should be sent, just return nothing or resolve promise with no value.

> Also a Client is provided for testing and simulation.

#### Install: 
```
npm install pcats-listener
```

#### Run Server:
```js
var listener = require('pcats-listener');

/**
 * Request processor function is injected into server to handle requests.
 *
 * @param {String} request
 * @returns {Promise} response or {String} response
 */
function processor(request){
    // process the request and return response
    return "Hello " + request;
}

var server = listener.createServer(processor);

server.listen(18888, localhost, function() {
    console.log('server bound');
});
```

#### Run Client:
```js
var listener = require('pcats-listener');
var client = listener.createClient();

client.connect(18888, 'localhost', function(err, connection) {
    if(err){
        // handle connection error
        return;
    }

    // 'response' event
    connection.on('response', function(response){
        console.log('got response', response);
        
        // disconnect
        connection.end();
    });

    // 'close' event - emitted if tcp connection was closed before connection.end() was called
    connection.on('close', function() {
        console.log('Sorry connection is lost, exiting...');
    });

    // send request
    connection.request("Hello");

});

```
also see examples folder for more client implementations

##### Client Connection API:
* ```connection.request(message, [callback])```
sends request. connection will emit 'response' event when response is received. The optional ```callback``` parameter will be executed when the data is finally written out - this may not be immediately

* ```connection.end()``` request connection to close

* ```Event: 'response'``` emits 'response' event when response is received

* ```Event: 'close'``` emits 'close' event if tcp connection was closed before connection.end() was called


