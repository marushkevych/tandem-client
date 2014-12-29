node-tcp-listener
=================
> Proprietary binary protocol over TCP

#### Install: 
```
npm install marushkevych/node-tcp-listener
```

#### Run Server:
```js
var listener = require('node-tcp-listener');
var server = listener.createServer();

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
    
    // 'close' event - emitted when tcp connection was closed before connection.end() was called
    connection.on('close', function() {
        console.log('Sorry connection is lost, exiting...');
    });
});

```
also see examples folder for more client implementations

#### Client Connection API:
- ```Connection.request(message, callback)``` - sends request and passes response to callback function
- ```Connection.end()``` - request connection to close (this will result in 'close' event, see below)
- emits ```close``` event when tcp connection was closed before connection.end() was called


