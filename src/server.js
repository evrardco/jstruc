const { start } = require('repl');

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

var app_path = process.env.SINGLEPLAYER === "true" ? "jstruc-solo" : "jstruc-multi"


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
app.get( `/${app_path}/`, function( req, res ){ 
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
var p1_name = undefined;
var p2 = undefined;
var p2_name = undefined;
let populated = 0; 
let game_started = false;
//Socket.io will call this function when a client connects, 
//So we can send that client a unique ID we use so we can 
//maintain the list of players.
n_conn = 0;
function reset_game_state() {
    console.log("Resetting server state")
    sio.disconnectSockets();
    p1 = undefined;
    p1_name = undefined;
    p2 = undefined;
    p2_name  = undefined;
    n_conn = 0;
    populated = 0;
    game_started = false;
}
sio.sockets.on('connection', function (client) {
    if (n_conn >= 2) {
        client.emit("full");
        return;
    }
    if(p1 === undefined){
        p1 = client;
        console.log("Player 1 connected");
        client.on('name', function (data, cb) {
            p1_name = data;
            cb("ok");
        });
        n_conn = 1;
    } else  {
        p2 = client;
        console.log("Player 2 connected");
        client.on('name', function (data, cb) {
            if (p1 === undefined) {
                p1 = client;
                p1_name = "data";
                p2 = undefined;
                console.log(
                    "Player 1 disconnected while waiting " +
                    "for the name of player 2"
                )
                n_conn = 1;
                
            } else {
                p2_name = data;
                cb("ok");
                
            }
        });
        n_conn = 2;
    }


    client.on('populated', () => {
        if (n_conn < 2) {
            game_started = true;
            reset_game_state();
            return;
        }
        populated += 1;
        console.log("Populated: " + populated)
        if (populated >= 2) {
            n_ready = 0;
            let check_players_ready = () => {
                n_ready += 1;
                if (n_ready  >=  2) {
                    p1.emit('players_ready');
                    p2.emit('players_ready');
                    p1.other = p2;
                    p2.other = p1;
                }
            };
            p1.emit('left', check_players_ready);
            p2.emit('right', check_players_ready);
        }
    })

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
        if (game_started) {
            reset_game_state();
        } else {
            if (client == p1) {
                p1 = p2;
                p1_name = p2_name;
            } 
            p2 = undefined;
            p2_name = undefined;
            n_conn--;
        }
        


    });
    client.on("game_start", () => {
        game_started = true;
        setTimeout( () => {
            reset_game_state();
        }, 1000 * 60 * 10);
        
    })
    client.on('update', function(data){
        if(client.other === undefined) return;
        client.other.emit('update', data);
        if (client === p1) {
            p2.emit('update', data);
        } else if (client === p2){
            p1.emit('update', data);
        }   
        
    }) //client.on disconnect


}); //sio.sockets.on connection
