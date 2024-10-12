/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström 
    
    http://underscorediscovery.com
    
    MIT Licensed. See LICENSE for full license.
    Usage : node simplest.app.js
*/
var 
single_player = process.env.SINGLEPLAYER === "true" ? true : false;

var 
gameport        = process.env.SERVER_PORT,


express         = require('express'),
UUID            = require('node-uuid'),

verbose         = true,
app             = express();



/* Express server set up. */

//The express server handles passing our content to the browser,
//As well as routing users where they need to go. This example is bare bones
//and will serve any file the user requests from the root of your web server (where you launch the script from)
//so keep this in mind - this is not a production script but a development teaching tool.

//Tell the server to listen for incoming connections
var http = require('http').createServer(app)
var sio = require('socket.io')(http, {
    cors: {
      origin: `http://${process.env.SERVER_IP}:${process.env.PORT}`,
      methods: ["GET", "POST"]
    },
    allowEIO3: true
});


http.listen(gameport);


//Log something so we know that it succeeded.
console.log('\t :: Express :: Listening on port ' + gameport );

//By default, we forward the / path to index.html automatically.
app.get( '/', function( req, res ){ 
    if (req.query && Object.keys(req.query).length > 0) {
        console.log('\t  :: Express  :: Query received: ', req.query );
        res.send(single_player);
    } else {
        if (single_player) 
            res.sendFile( __dirname + '/index_solo.html' );
        else
            res.sendFile( __dirname + '/index_multi.html' );
    }
    
});

app.get('/', function(req, res){
    res.send('id: ' + req.query.id);
});
  
//This handler will listen for requests on /*, any file from the root of our server.
//See expressjs documentation for more info on routing.

app.get( '/*' , function( req, res, next ) {

    //This is the current file they have requested
    var file = req.params[0]; 

        //For debugging, we can track what files are requested.
    if(verbose) console.log('\t :: Express :: file requested : ' + file);

        //Send the requesting client the file.
    res.sendFile( __dirname + '/' + file );

});


//Configure the socket.io connection settings. 
//See http://socket.io/
sio.use(function(socket, next) {
    var handshakeData = socket.request;
    // make sure the handshake data looks good as before
    // if error do this:
      // next(new Error('not authorized'));
    // else just call next
    next();
});



var p1 = undefined;
var p1_ip = undefined;
var p2 = undefined;
var p2_ip = undefined;

//Socket.io will call this function when a client connects, 
//So we can send that client a unique ID we use so we can 
//maintain the list of players.
sio.sockets.on('connection', function (client) {
    if(p1 === undefined){
        p1 = client;
        p1_ip = client.handshake.address
        client.emit("left");
        client.emit("waiting");
        console.log("Left player connected.");
    } else {
        if(p2 === undefined && p1_ip !== client.handshake.address){
            p2 = client;
            p2_ip = client.handshake.address
            client.emit("right");
            
            console.log("Right player connected.");
        } else {
            client.emit('jstruc-disconnect', {reason: 'server full.'});
            
        }
    }
    //Generate a new UUID, looks something like 
    //5b2ca132-64bd-4513-99da-90e838ca47d1
    //and store this on their socket/connection
    client.userid = UUID();

        //tell the player they connected, giving them their id
    client.emit('onconnected', { id: client.userid } );

        //Useful to know when someone connects
    console.log('\t socket.io:: player ' + client.userid + ' connected');
    
        //When this client disconnects
    client.on('disconnect', function () {

            //Useful to know when someone disconnects
        console.log('\t socket.io:: client disconnected ' + client.userid );
        client.broadcast.emit("gameover");
        if(client === p1 && p2 !== undefined){
            p2.disconnect();
        }else{
            p1.disconnect();
        }
        p1 = p2 = undefined;

    });
    client.on('update', function(data){
        console.log("updating, other: "+client.other);
        if(client.other === undefined) return;
        client.other.emit('update', data);
        
    }) //client.on disconnect

    client.on('start', function(data){
        console.log("Right told us to start, let's go !");
        p2.emit("ready");
        p1.emit("ready");
        p1.other = p2;
        p2.other = p1;
    });

}); //sio.sockets.on connection
