/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström 
    
    http://underscorediscovery.com
    
    MIT Licensed. See LICENSE for full license.
    Usage : node simplest.app.js
*/

var 
gameport        = process.env.PORT || 4004,

io              = require('socket.io'),
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
app.listen( gameport );

//Log something so we know that it succeeded.
console.log('\t :: Express :: Listening on port ' + gameport );

//By default, we forward the / path to index.html automatically.
app.get( '/', function( req, res ){ 
    res.sendFile( __dirname + '/index.html' );
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
