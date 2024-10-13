//don't add stuff that might throw errors here...
import {Game} from "./classes/game.js"
import { pong } from "./scenarios/tests/pong.js"


export let game;
document.addEventListener('readystatechange', event => {

    if (event.target.readyState === "interactive") {      //same as:  document.addEventListener("DOMContentLoaded"...   // same as  jQuery.ready
        //All HTML DOM elements are accessible
    }

    if (event.target.readyState === "complete") {
        //Now external resources are loaded too, like css,src etc... 

        startup();
        //document.getElementById('game').addEventListener('keypress', handleKeyPress);
        
    }

});

export function startup(){
    
    init().then( () => {
        game.scenario.populate();
        let wait_game_ready = new Promise( (resolve, reject) => {
            if (!game.local) {
                game.socket.on("players_ready", () => {
                    console.log("Players ready !");
                    resolve();
                });
            } else {
                resolve();
            }
            
        });
        console.log("Waiting for all players to be ready...");
        return wait_game_ready;
    }).then( () => {
        if (!game.local) {
            game.socket.on("update", updateHandler);
        }
        launch()
    });
}

async function init(){
    let url = window.location.href;
    //send a GET request to the server, asking if this is single player or multiplayer
    game = new Game();
    console.log("Sending mode request to " + `${url}?single`)
    await fetch(
        `${url}?single`
    ).then(
        response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`bad request`);
            }
        }
    ).then(data => {
        console.log(`received data: ${JSON.stringify(data)}`);
        if (JSON.stringify(data) === "true") {
            game.local = true;
            console.log(`single player mode`);
        } else {
            game.local = false;
            console.log(`multiplayer mode`);
        }
    
        game.scenario = pong;
        window.addEventListener("keydown", keyDispatch);
        window.addEventListener("keyup", keyRemove);
        if(!game.local){
            console.log(`connecting to server`);
            console.log("Connecting to socket at " + url)
            game.socket = io(url, {transports: ["websocket"]});
            //Now we can listen for that event
            game.socket.on('onconnected', function( data ) {
                    //Note that the data is the object we sent from the server, as is. So we can assume its id exists. 
                console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
                game.pid = data.id;
            });
            game.socket.on('full', () => {
                alert("The server is full");
                return Promise.reject('full');
            })
            let buttonPressed = new Promise(function(resolve) {
                let button = document.getElementById("start");
                button.addEventListener("click", resolve);
            });
            return buttonPressed
        } else {
            return Promise.reject('solo');
        }
    }).then( () => {
        //deactivate the input elements
        console.log('Sending name to server')
        let button = document.getElementById("start");
        button.setAttribute("disabled", "true");
        let nameBox = document.getElementById("playerName");
        let nameVal = nameBox.value;
        nameBox.setAttribute("placeholder", "Waiting for server reply...");
        nameBox.setAttribute("disabled",  "true");
        //sending the name of the player to the server
        console.log(`Sending name ${nameVal} to server`);
        game.socket.emit("name", nameVal, (response) => {
            console.log(response); // "got it"
            if (response === "ko") {
                Promise.reject("Name refused");
            } else if (response === "ok") {
                console.log(`Name ${nameVal} accepted by server`);
            }
        });
        console.log('Waiting for the other player...');
        document.getElementById("playerName").placeholder = "Waiting for the other player...";
    }).catch((result) => {
        if (result !== 'solo')
            alert("Unexpected error: " + result);
        else 
            console.log("Starting solo game !");
    });


}

function interpolate(a0, va, t0, t1) {
    let dt = game.timeScale  * (t1 - t0) / 1000;
    if (dt > 0.1) return a0;
    return a0 + (va * dt);
}
function updateHandler(data){
    if(data.type === "player" && data.side === game.side) {
        return;
    }
    let t1 = Date.now() - game.start_time;
    // if (game.last_tstamp !== undefined && game.last_tstamp > data.tstamp) {
    //     return;
    // }
    //if tstamp is older than 2 frames, reject update
    if (t1 - data.tstamp > 2 * 16) {
        return;
    }
    let toUpdate = (data.type === "player") ? game.other : game.ball;
    toUpdate.pos.x = interpolate(data.pos.x, data.vel.x, data.tstamp, t1);
    toUpdate.pos.y = interpolate(data.pos.y, data.vel.y, data.tstamp, t1);

    toUpdate.vx = data.vel.x;
    toUpdate.vy = data.vel.y;
    game.last_tstamp = data.tstamp;
}



function launch(){
    if(!game.local){
        console.log("The game is ready.");
        //disable ui
        document.getElementById("ui").setAttribute("style", "visibility:hidden");
        document.getElementById("mainScreen").removeAttribute("style");
        game.socket.on("disconnect", (reason, details) => {
            alert('Disconnected from server !')
            game.over = true;
        });
        game.socket.emit("game_start");

        mainLoop();
    }else{
        mainLoop();
    }
}

function mainLoop() {
    if (game.start_time === undefined) {
        game.start_time = Date.now();
    }
    game.last = game.now;
    game.now = Date.now();

    //acting
    for (let i = 0; i < game.actors.length; i++) {
        // console.log("iterating through: " + game.actors[i].name);
        game.actors[i].act(game.timeScale * (game.now - game.last) / 1000);
    }

    //colliding
    for (let i = game.actors.length - 1; i >= 0; i--) {
        game.actors[i].collide();
    }

    game.context.clearRect(0, 0, game.width, game.height);
    //drawing
    for (let i = 0; i < game.actors.length; i++) {
        game.actors[i].draw(game.context);
    }

    if (!game.local) {
        if (
            game.last_sync === undefined ||
            (game.last_sync !== undefined && game.now - game.last_sync > 16)
        ) {
            game.scenario.synchronize();
            game.last_sync = game.now;
        }
        
    }

    game.tickNumber++;
    if (!game.over) {
        window.requestAnimationFrame(mainLoop);
    }


}

function keyDispatch(event){
    if(game.keyPressed.indexOf(event.key) !== -1) return;
    game.keyPressed.push(event.key);
}

function keyRemove(event){
    let i = game.keyPressed.indexOf(event.key);
    if(i !== -1){
        game.keyPressed.splice(i, 1);
    }
}
